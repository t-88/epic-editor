import { shared_globals } from "../runner/entities/Entity";
import { StatementType } from "./parser"



export default class OPTraspiler {
    constructor() {
        this.src = ""
        this.functions = {};
    }
    transpile(node,vars = []) {
        let src = ""
        if (node.type == StatementType.Program) {
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
            if(!vars.includes(node.name)) {
                vars.push(node.name);
            }
            src = node.name + " = " + this.transpile(node.val)
        }
        else if (node.type == StatementType.Para) {
            src = `(${this.transpile(node.expr)})`
        }
        else if (node.type == StatementType.Block) {
            src = "{"

            let vars = []; 
            for (let i = 0; i < node.block.length; i++) {
                src += this.transpile(node.block[i],vars)
                src += "\n"
            }
            
            // yes, am doing hoisting bc am too lazy 
            let var_declaration = "";
            for (let i = 0; i < vars.length; i++) {
                // skip . access
                if(vars[i].includes(".")) continue
                var_declaration += "let " + vars[i] + ";"
                
            }
            src = src.slice(0,1) + var_declaration + src.slice(1) 
            src += "}"

        }
        else if (node.type == StatementType.Conditional) {
            src = "if" + this.transpile(node.condition) + "\n"
            src += this.transpile(node.block)
        }
        else if (node.type == StatementType.FuncCall) {
            src = "this." + node.name + "("
            for (let i = 0; i < node.args.length; i++) {
                src += this.transpile(node.args[i])
                if (i < node.args.length - 1)
                    src += ","
            }
            src += ")"
        }
        else if (node.type == StatementType.ForIteration) {
            let variable = this.transpile(node.var);
            src = `for(let ${variable} = ${this.transpile(node.start)}; ${variable} < ${this.transpile(node.end)}; ${variable}++)\n`
            src += this.transpile(node.block)
        }
        else if (node.type == StatementType.FuncDeclaration) {
            src = "function " + node.name + "("
            for (let i = 0; i < node.args.length; i++) {
                src += node.args[i]
                if (i < node.args.length - 1)
                    src += ","
            }
            src += ")\n"
            let header = src;

            src += this.transpile(node.body)
            src = src.slice(0, header.length + 1) + shared_globals + src.slice(header.length + 1);
            this.functions[node.name] = src;
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


