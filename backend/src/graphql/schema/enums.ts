import * as PrismaModule from '@prisma/my-client';

const createEnumString = (enumObj: object) => {
    const keys = Object.keys(enumObj);
    if (keys.length === 0) {
        return 'EMPTY_ENUM';
    }
    return keys.map(key => `${key}`).join('\n  ');
};

const generateEnumsSchema = () => {
    const Enums = (PrismaModule as any).$Enums || {};

    const enumsToProcess = Object.keys(Enums).length > 0 ? Enums : PrismaModule;

    let schema = '';

    for (const [key, value] of Object.entries(enumsToProcess)) {
        if (
            key !== 'Prisma' && 
            key !== 'PrismaClient' && 
            key !== 'default' && 
            typeof value === 'object' && 
            value !== null &&
            !key.startsWith('$') && 
            !key.startsWith('__')
        ) {
             const values = Object.values(value as object);
             if (values.length > 0 && values.every(v => typeof v === 'string')) {
                 schema += `
enum ${key} {
  ${createEnumString(value as object)}
}
`;
             }
        }
    }

    return schema;
};

export default generateEnumsSchema;
