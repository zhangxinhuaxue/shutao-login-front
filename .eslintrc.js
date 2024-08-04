module.exports = {
    root: true,
    env: {
        browser: true
    },
    extends: ['plugin:vue/essential'],
    plugins: ['vue-libs'],
    // extends: 'standard', //airbnb-base | standard
    // plugins: ['html'],
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    globals: {
        Sentry: true,
        window: true,
        aixuedai: true,
        $: true,
        axdApp: true,
        __webpack_public_path__: true
    },
    // add your custom rules here
    rules: {
        'space-before-function-paren': 0,
        'no-useless-escape': 0,
        'no-use-before-define': 0,
        'no-unused-vars': [
            0,
            {
                varsIgnorePattern: '[iI]gnored|rem'
            }
        ],
        'no-new': 0,
        'handle-callback-err': 0,
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: {
                    var: 2,
                    let: 2,
                    const: 3
                },
                outerIIFEBody: 1
            }
        ],
        'linebreak-style': 0, // ["warn", "windows"],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        eqeqeq: [0, 'allow-null'],
        'operator-linebreak': [0, 'before'],
        //"no-extra-semi": ["error"],
        // override default options for rules from base configurations
        'comma-dangle': ['error', 'never'],
        'no-cond-assign': ['error', 'always'],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'arrow-body-style': [0, 'always'],
        'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
