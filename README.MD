# JISP, Lisp in JS
JISP is a educational little interpreter that understands a limited version of lisp.

# Example
Jisp features `lambda functions` created in jisp with the keyword `fn`, definitions using `define` a cond operator `if` and simple operations like `*, +, eq, -`

this is a fully working example of a jisp program featuring lambdas, recursion, and defines
```lisp
(
    (define fact(fn (x) 
        (
            if (eq x 0)
                (1)
                (* (fact (- 1 x)) x)
            )
        )
    )
    (print (fact 12))
)
```

# Turing completness
TODO

# References:
- https://norvig.com/lispy.html
- https://stopa.io/post/222