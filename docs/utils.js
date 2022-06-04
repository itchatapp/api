import fs from 'node:fs/promises'
import { join } from 'node:path'

export async function readdir(dir) {
    const result = [];

    await (async function read(dir) {
        const files = await fs.readdir(dir)
        for (const filepath of files.map((p) => join(dir, p))) {
            const stat = await fs.stat(filepath)
            if (stat.isDirectory()) await read(filepath)
            else result.push(filepath)
        }
    })(dir);

    return result
}

export const isPrimitive = (type) => ['string', 'number', 'bigint', 'boolean', 'integer'].includes(type)

export function Union(type) {
    return type.split(' | ').map(x => x.replace(/'|"|;/g, ''))
}

export function Response({ status, description, type }) {
    function Json(obj) {
        return { "application/json": obj }
    }

    switch (status) {
        case 204: return { description: "Success" }
        case 200: {
            const array = type.endsWith('[]')

            if (array) type = type.replace(/\[\]/g, '')

            const union = Union(type)

            if (union.length > 1) return { description, content: Json({ schema: Schema({ union, array }) }) }

            return { description, content: Json({ schema: Schema({ type, array }) }) }
        }
        default: return {
            description: "An error occurred.",
            content: Json({ schema: Ref('Error') })
        }
    }
}


export function Param(name) {
    return {
        name,
        in: "path",
        required: true,
        schema: { type: 'string' }
    }
}

export function Primitive(type, nullable = false) {
    return { type, nullable }
}

export function Array(type, nullable = false) {
    return {
        type: 'array',
        items: type,
        nullable
    }
}

export function Schema({ type, array, nullable, $enum, record, union }) {
    if (type === 'number') type = 'integer'

    if (type && isPrimitive(type)) {
        return array ? Array(Primitive(type, false), nullable) : Primitive(type, nullable)
    } else if ($enum) {
        return { type: 'string', enum: $enum }
    } else if (record) {
        return { additionalProperties: Schema({ type: record }) }
    } else if (union) {
        return { oneOf: union.map(x => Schema({ type: x, array })) }
    } else {
        return array ? Array(Ref(type), nullable) : Ref(type)
    }
}


export function Ref(reference) {
    return { $ref: `#/components/schemas/${reference}` }
}

export function parse(content) {
    const results = []
    const propertyRegex = /([a-z_?]+)!?: ([a-z\[\]]+)/gi
    const typeRegex = /type (.+) = (.+)/gi
    const enumRegex = /enum(.*)\{(?:.|\n)*?\n\}/g

    let result;

    while (result = propertyRegex.exec(content)) {
        let [, name, type] = result

        if (!name || !type) return null

        const array = type.endsWith('[]')
        const nullable = name.endsWith('?')

        name = name.replace('?', '')
        type = type.replace('[]', '')

        results.push([name, Schema({ type, array, nullable })])
    }

    while (result = typeRegex.exec(content)) {
        let [, name, type] = result

        const [, record] = type.match(/Record<string, ([a-z]+)>/i) ?? []

        if (record) {
            results.push([name, Schema({ record })])
            continue
        }

        const union = Union(type)

        if (union.length > 1) {
            results.push([name, Schema({ union })])
            continue
        }

        results.push([name, Schema({ type })])
    }

    while (result = enumRegex.exec(content)) {
        let [, name] = result

        content = content.split('\n').slice(1, -1).join('\n').split(',').map(x => x.replace(/\s|\n/g, ''))

        results.push([name, Schema({ $enum: content })])
    }

    return results
}

export function ensure(obj, path, defaultValue = {}) {
    let parent = obj, value = obj, lastKey = path

    for (const key of path.split('.')) {
        (parent = value, value = parent[key], lastKey = key)
        if (typeof value === 'undefined') value = parent[key] = path.endsWith(lastKey) ? defaultValue : {}
    }

    return parent[lastKey] = parent[lastKey] ?? defaultValue
}