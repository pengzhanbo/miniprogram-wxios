import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';

export default [{
    input: 'index.js',
    output: [
        {
            file: 'dist/wxios.common.js',
            format: 'cjs',
        },
        {
            file: 'dist/wxios.esm.js',
            format: 'esm',
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        })
    ]
}, {
    input: 'index.js',
    output: [
        {
            file: 'dist/wxios.common.min.js',
            format: 'cjs',
        },
        {
            file: 'dist/wxios.esm.min.js',
            format: 'esm',
        }
    ],
    plugins: [
        uglify(),
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
    ]
}];
