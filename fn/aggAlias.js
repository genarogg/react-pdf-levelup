import fs from 'fs';

const updateTsconfigPaths = () => {
    const tsconfigPath = './tsconfig.json';
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.paths = {
        "@components/*": ["./src/components/*"],
        "@fn/*": ["./src/functions/*"],
        "@env": ["./env.ts"],
        "@public/*": ["./public/*"],
        "@nano": ["./src/components/nano/index.tsx"],
    };

    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');

    console.log('tsconfig.json actualizado correctamente');
};

updateTsconfigPaths();