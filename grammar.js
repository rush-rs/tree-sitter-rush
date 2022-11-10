module.exports = grammar({
    name: 'rush',
    extras: $ => [
        / |\n|\t|\r/,
        $.line_comment,
        $.block_comment,
    ],

    precedences: $ => [
        [
            'call',
            'prefix',
            'infix_pow',
            'cast',
            'infix_product',
            'infix_sum',
            'infix_shift',
            'infix_relation',
            'infix_equality',
            'bitwise_and',
            'bitwise_xor',
            'bitwise_or',
            'logical_and',
            'logical_or',
            'assign',
        ],
        [
            'expr',
            'stmt',
        ],
    ],

    rules: {
        program: $ =>
            choice(
                repeat($.function_definition),
                seq(repeat($._statement), optional($._expression)),
            ),

        function_definition: $ =>
            seq(
                'fn',
                field('name', $.ident),
                '(',
                field('params', commaSep($.parameter)),
                ')',
                optional(field('return_type', seq('->', $.type))),
                field('body', $.block),
            ),
        parameter: $ =>
            seq(
                optional('mut'),
                field('name', $.ident),
                ':',
                field('type', $.type),
            ),

        block: $ =>
            seq(
                '{',
                field('stmts', repeat($._statement)),
                optional(field('expr', $._expression)),
                '}',
            ),
        type: $ => choice($.ident, seq('(', ')')),

        _statement: $ =>
            choice(
                $.let_stmt,
                $.return_stmt,
                $.expr_stmt,
            ),
        let_stmt: $ =>
            seq(
                'let',
                optional('mut'),
                field('name', $.ident),
                optional(field('type', seq(':', $.type))),
                '=',
                field('expr', $._expression),
                ';',
            ),
        return_stmt: $ => seq('return', optional(field('expr', $._expression)), ';'),
        expr_stmt: $ =>
            prec(
                'stmt',
                field(
                    'expr',
                    choice(
                        seq($._expr_without_block, ';'),
                        seq($._expr_with_block, optional(';')),
                    ),
                ),
            ),

        _expression: $ =>
            prec(
                'expr',
                choice(
                    $._expr_without_block,
                    $._expr_with_block,
                ),
            ),
        _expr_with_block: $ => choice($.block, $.if_expr),
        if_expr: $ =>
            seq(
                'if',
                field('cond', $._expression),
                field('then_block', $.block),
                optional(
                    field(
                        'else_block',
                        seq('else', choice($.if_expr, $.block)),
                    ),
                ),
            ),
        _expr_without_block: $ =>
            choice(
                $.int,
                $.float,
                $.bool,
                $.char,
                $.ident,
                $.prefix_expr,
                $.infix_expr,
                $.assign_expr,
                $.call_expr,
                $.cast_expr,
                seq('(', $._expression, ')'),
            ),
        prefix_expr: $ => prec('prefix', seq(choice('!', '-'), field('expr', $._expression))),
        infix_expr: $ =>
            choice(
                ...[
                    ['+', 'infix_sum'],
                    ['-', 'infix_sum'],
                    ['*', 'infix_product'],
                    ['/', 'infix_product'],
                    ['%', 'infix_product'],
                    ['**', 'infix_pow', 'right'],
                    ['==', 'infix_equality'],
                    ['!=', 'infix_equality'],
                    ['<', 'infix_relation'],
                    ['>', 'infix_relation'],
                    ['<=', 'infix_relation'],
                    ['>=', 'infix_relation'],
                    ['<<', 'infix_shift'],
                    ['>>', 'infix_shift'],
                    ['|', 'bitwise_or'],
                    ['^', 'bitwise_xor'],
                    ['&', 'bitwise_and'],
                    ['&&', 'logical_and'],
                    ['||', 'logical_or'],
                ].map(([operator, precedence, associativity]) =>
                    (associativity === 'right' ? prec.right : prec.left)(
                        precedence,
                        seq(
                            field('lhs', $._expression),
                            field('op', operator),
                            field('rhs', $._expression),
                        ),
                    )
                ),
            ),
        assign_expr: $ =>
            prec(
                'assign',
                choice(
                    ...[
                        '=',
                        '+=',
                        '-=',
                        '*=',
                        '/=',
                        '%=',
                        '**=',
                        '<<=',
                        '>>=',
                        '|=',
                        '&=',
                        '^=',
                    ].map(op =>
                        seq(
                            field('assignee', $.ident),
                            field('op', op),
                            field('expr', $._expression),
                        )
                    ),
                ),
            ),
        call_expr: $ =>
            prec(
                'call',
                seq(
                    field('func', $.ident),
                    '(',
                    field('args', commaSep($._expression)),
                    ')',
                ),
            ),
        cast_expr: $ => prec('cast', seq($._expression, 'as', $.type)),

        ident: $ => /[a-zA-Z_][a-zA-Z_0-9]*/,
        int: $ => /[0-9][0-9_]*|0x[0-9A-Fa-f][0-9A-Fa-f_]*/,
        float: $ => /[0-9][0-9_]*(\.[0-9][0-9_]*|f)/,
        // TODO: retry highlighting escape sequences
        char: $ =>
            token(seq(
                "'",
                optional(choice(
                    seq(
                        '\\',
                        choice(
                            /[\\bnrt']/,
                            /x[0-9a-fA-F]{2}/,
                        ),
                    ),
                    /[^\\']/,
                )),
                "'",
            )),
        bool: $ => choice('true', 'false'),

        line_comment: $ => /\/\/.*/,
        block_comment: $ =>
            token(seq(
                '/*',
                /[^*]*\*+([^/*][^*]*\*+)*/,
                '/',
            )),
    },
})

function commaSep(rule) {
    return optional(seq(rule, repeat(seq(',', rule)), optional(',')))
}
