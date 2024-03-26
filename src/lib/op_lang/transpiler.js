import { StatementType } from "./parser"



export default class OPTraspiler {
    constructor() {
        this.src = ""
        this.prefix_functions = ""
    }
    transpile(node, iden = 0, prefix_functions = "") {
        let src = ""
        let identation = "\t".repeat(iden)

        if (node.type == StatementType.Program) {
            this.prefix_functions = prefix_functions
            for (let i = 0; i < node.statements.length; i++) {
                src += this.transpile(node.statements[i])
                src += "\n"
            }
        }
        else if (node.type == StatementType.String) {
            src = `"${node.val}"`
        }
        else if (node.type == StatementType.Number) {
            src = `${node.val}`
        }
        else if (node.type == StatementType.Identifier) {
            src = node.val
        }
        else if (node.type == StatementType.ArthOp) {
            src = this.transpile(node.left) + " " + node.op + " " + this.transpile(node.right)
        }
        else if (node.type == StatementType.BooleanOp) {
            src = this.transpile(node.left) + " " + node.op + " " + this.transpile(node.right)
        }
        else if (node.type == StatementType.VarAssigment) {
            src = identation + node.name + " = " + this.transpile(node.val)
        }
        else if (node.type == StatementType.Para) {
            src = `(${this.transpile(node.expr)})`
        }
        else if (node.type == StatementType.Block) {
            src = "{"
            for (let i = 0; i < node.block.length; i++) {
                src += this.transpile(node.block[i])
                src += "\n"
            }
            src += "}"

        }
        else if (node.type == StatementType.Conditional) {
            src = identation + "if" + this.transpile(node.condition) + "\n"
            src += this.transpile(node.block, iden + 1)
        }
        else if (node.type == StatementType.FuncCall) {
            src = identation + node.name + "("
            for (let i = 0; i < node.args.length; i++) {
                src += this.transpile(node.args[i])
                if (i < node.args.length - 1)
                    src += ","
            }
            src += ")"
        }
        else if (node.type == StatementType.ForIteration) {
            let variable = self.transpile(node.var);
            src = identation + `for(let ${variable} = ${this.transpile(node.start)}; ${variable} < ${this.transpile(node.end)}; ${variable}++)\n`
            src += this.transpile(node.block, iden + 1)
        }
        else if (node.type == StatementType.FuncDeclaration) {
            src = "function " + self.prefix_functions + node.name + "("
            for (let i = 0; i < node.args.length; i++) {
                src += node.args[i]
                if (i < node.args.length - 1)
                    src += ","
            }
            src += ")\n"
            src += this.transpile(node.body, iden + 1)
        }
        else if (node.type == StatementType.TableLookup) {
            src += node.table + "["
            src += `"${node.key}"`
            src += "]"
        }
        else {
            throw (`[Transpiler Error] Unexpected node to be transpiled '${node}'`)
        }
        return src
    }
}
