/**
 * Lisp interpreter on node.js
 * intended for educational purposes only
 * written in js as a POC to be rewritten in rust later
 */

const blacklist = ['', '\n', ' ']

function tokenizer(text) {
    text = text.replace(/\n/gi, '')
    text = text.split("(").join(' ( ')
    text = text.split(")").join(' ) ')
    return text.split(" ").filter(f => !blacklist.includes(f))
}

// parses single atoms
function atom(token) {
    const number = parseFloat(token)
    return Number.isNaN(number) ? token : number
}

// if a ) is not present it crashes out of memory :)
function parser(tokens) {
    const token = tokens.shift()
    if (token === '(') {
        // start parsing list
        const subTokens = []
        while (tokens[0] !== ')') {
            subTokens.push(parser(tokens))
        }
        tokens.shift() // remove the last )
        return subTokens
    } else if (token === ')') {
        throw new Error("Unexpected )")
    } else {
        return atom(token)
    }
}

const default_env = {
    '+': (list) => list.reduce((a, b) => a + b, 0),
    '-': (list) => list.reduce((a, b) => b - a, 0),
    '*': (list) => list.reduce((a, b) => a * b, 1),
    'print': (list) => console.log(list),
    'eq': ([a, b]) => a === b
}

function zip(a, b) {
    return a.reduce((acc, k, index) => {
        acc[k] = b[index]
        return acc
    }, {})
}

function lambda(params, body) {
    return function (args, env) {
        const subEnv = { ...env, ...zip(params, args) }
        return lispEval(body, subEnv)    
    }
}

function lispEval(exp, env) {
    if (exp.length && exp.length > 1) {
        if (typeof exp[0] === 'string') {
            if (exp[0] === 'define') {
                env[[exp[1]]] = lispEval(exp[2], env)
                return exp[2]
            }
            if (exp[0] === 'fn') {
                const [op, params, body] = exp
                return lambda(params, body)
            }
            if (exp[0] === 'if') {
                const [op, cond, a, b] = exp
                console.log('cond', lispEval(cond, env))
                console.log('a', a)
                console.log('b', b)
                if (lispEval(cond, env)) {
                    return lispEval(a, env)
                } else {
                    return b ? lispEval(b, env) : []
                }
            } else {
                const res = env[exp[0]]
                if (res) {
                    return res(exp.slice(1).map(e => lispEval(e, env)), env)
                } else {
                    throw new Error(`symbol ${exp[0]} not in scope`)
                }
            }
        } else {
            return exp.map(e => lispEval(e, env))
        }
    } else if (typeof exp === 'string') {
        console.log(env)
        const res = env[exp]
        if (res !== undefined) {
            return res
        } else {
            throw new Error(`symbol ${exp[0]} not in scope`)
        }
    } else {
        return exp
    }
}

const input_test_complex = `
(main 
    (+ 1 1)
    (if (= 1 1)
        (print pretty-good)
        (print oops)
    )
    (return 42)
)
`

const input_test = `
(
    (define fact
        (fn (x) (
            if (eq x 0)
                (1)
                (* (fact (- 1 x)) x)
            )
        )
    )
    (print (fact 12))
)
`
console.log(tokenizer("(fn (x) (* x x))"))
// console.log(parser(tokenizer(input_test)))
// lispEval(parser(tokenizer(input_test)), default_env)