import fs from 'node:fs/promises'
import { join } from 'node:path'
import { readdir, parse, ensure, Response, Param } from './utils.js'

const OpenAPI = {
    openapi: "3.0.0",
    info: {
        title: "ItChatAPI API",
        version: '1.0.0'
    },
    servers: [{
        url: "https://api.itchat.world",
        description: "ItChat API"
    }],
    paths: {},
    components: {
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    status: { type: 'integer' }
                }
            }
        }
    }
}

const classes = {}, enums = {}, interfaces = {}, types = {}

for (const path of await readdir(join(process.cwd(), 'src/structures'))) {
    if (!['index.ts', '/Base.ts'].every(name => !path.endsWith(name))) continue

    const content = await fs.readFile(path, 'utf8')

    for (let [$class, name, extendsThisClass] of content.matchAll(/class\s*([a-z]+)\s*(?:extends ([a-z]+)\s*)?\{(.|\n)*?\n\}/gi)) {
        if (extendsThisClass && extendsThisClass !== 'Base') name = name + ':' + extendsThisClass
        classes[name] = $class.replace(/.+\(.*\).*\{(.|\n)*?\n\s*\}/g, '').replace(/static .+\(.+\)(?::\s*.+)/g, '')
    }
    for (const [$interface, name] of content.matchAll(/interface\s*([a-z]+)\s*\{(.|\n)*?\n\}/gi)) interfaces[name] = $interface
    for (const [$enum, name] of content.matchAll(/enum\s*([a-z]+)\s*\{(?:.|\n)*?\n\}/gi)) enums[name] = $enum
    for (const [$type, name] of content.matchAll(/type\s*([a-z]+)\s*=\s*.+/gi)) types[name] = $type
}


for (const [name, content] of Object.entries(interfaces)) {
    const schema = ensure(OpenAPI, `components.schemas.${name}`)

    for (const [name, type] of parse(content)) {
        if (type.oneOf) {
            schema.oneOf = type.oneOf
        } else if (type.additionalProperties) {
            schema.additionalProperties = type.additionalProperties
        } else {
            ensure(schema, 'required', [])
            ensure(schema, 'properties', {})
            if (!type.nullable) schema.required.push(name)
            schema.properties[name] = type
        }
    }
}

for (const [$name, content] of Object.entries(classes)) {
    const [name, extendsThisClass] = $name.split(':')
    const schema = ensure(OpenAPI, `components.schemas.${name}`)

    function process(content) {
        for (const [name, type] of parse(content)) {
            if (type.oneOf) {
                schema.oneOf = type.oneOf
            } else if (type.additionalProperties) {
                schema.additionalProperties = type.additionalProperties
            } else {
                ensure(schema, 'required', [])
                ensure(schema, 'properties', {})
                if (!type.nullable) schema.required.push(name)
                schema.properties[name] = type
            }
        }
    }

    if (extendsThisClass) process(classes[extendsThisClass])
    process(content)
}

for (const [name, content] of Object.entries(types)) {
    const [, type] = parse(content)[0] ?? []

    if (!type) {
        console.log(content)
        continue
    }

    OpenAPI.components.schemas[name] = type
}


for (const [name, content] of Object.entries(enums)) {
    const [, type] = parse(content)[0] ?? []

    if (!type) {
        console.log(content)
        continue
    }

    OpenAPI.components.schemas[name] = type
}

for (const path of await readdir(join(process.cwd(), 'src/controllers'))) {
    if (!['index.ts', '/Controller.ts'].every(name => !path.endsWith(name))) continue

    const content = await fs.readFile(path, 'utf8')
    const basePath = content.match(/path = '(.+)'/)?.[1] ?? ''
    const regex = /'(GET|POST|DELETE|PATCH|PUT) (.+)'\(_?ctx: Context\)(?:: Promise<(.+)> {)?/g

    let result;

    while (result = regex.exec(content)) {
        let [, method, path, type = 'unknown'] = result

        method = method.toLowerCase()
        path = (basePath + path).replace(/:([a-z_]+)/gi, '{$1}')

        if (path.endsWith('/')) path = path.slice(0, -1)

        // TODO: Get summary and description.
        const schema = ensure(OpenAPI, `paths.${path}.${method}`, {
            summary: '',
            description: '',
            parameters: [],
            responses: {},
        })

        for (const [, name] of path.matchAll(/{([a-z]+_id)}/gi)) {
            schema.parameters.push(Param(name))
        }

        schema.responses.default = Response({ status: 'default' })

        if (type === 'void' || method === 'delete' || type === 'unknown') {
            schema.responses[204] = Response({ status: 204 })
        } else {
            // TODO: Get description
            schema.responses[200] = Response({ status: 200, type, description: '' })
        }
    }
}

await fs.writeFile('docs/OpenAPI.json', JSON.stringify(OpenAPI, null, 2))