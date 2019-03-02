import { Plugin, Action } from '@fivethree/billy-core';
import { Project, ClassDeclaration, SourceFile, MethodDeclaration } from "ts-morph";
import { BillyDocumentation, BillyMethodDocumentation, Param, BillyActionDocumentation, BillyPluginDocumentation, ReturnDoc, ParamDoc } from './types'
import cronstrue from 'cronstrue';



@Plugin('Plugin to create Docs from billy files')
export class BillyDocsPlugin {

    /**
     *
     * @param {string} path path to the billy app directory
     * @returns {Promise<BillyDocumentation>}  Returns the plugins Documentation Object
     * @memberof BillyDocsPlugin
     */
    @Action('get Documentation for a billy app as JSON')
    async billyDocs(path: string): Promise<BillyDocumentation> {
        const project = new Project({
            compilerOptions: {
                tsConfigFilePath: `${path}/tsconfig.json`
            }
        });

        const srcFile: SourceFile = project.addExistingSourceFile(`${path}/src/billy.ts`);
        const appClass = srcFile.getClasses().find(c => !!c.getDecorator('App'));
        if (appClass) {
            return this.visitClass(appClass);
        } else {
            console.log('Something went wrong :( Make sure to set the @App() Decorator to your class.');
        }
    }


    /**
     *
     * @param {string} path path to billy plugin directory
     * @returns {Promise<BillyPluginDocumentation>} Returns the plugins Documentation Object
     * @memberof BillyDocsPlugin
     */
    @Action('get Documentation for a plugin as JSON')
    async pluginDocs(path: string): Promise<BillyPluginDocumentation> {
        const project = new Project({
            compilerOptions: {
                tsConfigFilePath: `${path}/tsconfig.json`
            }
        });

        const srcFile: SourceFile = project.addExistingSourceFile(`${path}/src/plugin.ts`);
        const appClass = srcFile.getClasses().find(c => !!c.getDecorator('Plugin'));
        if (appClass) {
            return this.visitPlugin(appClass);
        } else {
            console.log('Something went wrong :( Make sure to set the @Plugin() Decorator to your class.');
        }

    }

    private visitClass(c: ClassDeclaration): BillyDocumentation {

        const allowedDecorators = ['Lane', 'Scheduled', 'Hook', 'Webhook'];

        const methods = c.getMethods()
            .filter(method => method.getDecorators().some(dec => allowedDecorators.some(d => d === dec.getName())))
            .map(method => {

                const description = !!method.getDecorator('Lane') ? method.getDecorator('Lane').getStructure().arguments[0] : '';
                const formattedDescription = description ? description.substring(1, description.length - 1) : '';
                const schedule = !!method.getDecorator('Scheduled') ? method.getDecorator('Scheduled').getStructure().arguments[0] : '';
                const formattedSchedule = schedule ? schedule.substring(1, schedule.length - 1) : '';
                const human = formattedSchedule ? cronstrue.toString(formattedSchedule) : '';
                const hook = !!method.getDecorator('Hook') ? method.getDecorator('Hook').getStructure().arguments[0] : '';
                const formattedHook = hook ? hook.substring(1, hook.length - 1) : '';
                const endpoint = !!method.getDecorator('Webhook') ? method.getDecorator('Webhook').getStructure().arguments[0] : '';
                const formattedEndpoint = endpoint ? endpoint.substring(1, endpoint.length - 1) : '';


                const m: BillyMethodDocumentation = {
                    name: method.getName(),
                    description: formattedDescription,
                    schedule: formattedSchedule,
                    humanReadable: human,
                    hook: formattedHook,
                    endpoint: formattedEndpoint,
                    comment: method.getJsDocs().map(doc => doc.getComment()).join('\n'),
                    return: this.getReturnDoc(method),
                    params: method.getParameters().map(param => {
                        const p: Param = {
                            name: param.getName(), type: param.getType().getText()
                        }
                        return p;
                    }),
                    docs: method.getJsDocs()
                        .map(docs => {
                            return docs.getTags().map(tag => {
                                const d: ParamDoc = {
                                    kind: tag.getTagName(),
                                    name: tag.getSymbol() ? tag.getSymbol().getName() : '',
                                    comment: tag.getComment()
                                }
                                return d;
                            })
                                .filter(metDoc => metDoc.kind === 'param')

                        })[0]
                }
                return m;
            });

        const classDescription = c.getJsDocs().map(doc => doc.getComment()).join('\n')
        const billy: BillyDocumentation = {
            name: c.getName(),
            description: classDescription,
            methods: methods
        }

        return billy;
    }
    getReturnDoc(method: MethodDeclaration): ReturnDoc {
        const docs = method.getJsDocs();
        if (!docs || docs.length === 0) {
            return;
        }

        const returns = docs[0].getTags().find(tag => tag.getTagName() === 'returns');
        if (returns) {
            const type = returns.getType().getText();
            const comment = returns.getComment();

            return { type: type, comment: comment };
        }

    }

    private visitPlugin(c: ClassDeclaration): BillyPluginDocumentation {

        const allowedDecorators = ['Action'];

        const methods = c.getMethods()
            .filter(method => method.getDecorators().some(dec => allowedDecorators.some(d => d === dec.getName())))
            .map(method => {

                const description = !!method.getDecorator('Action') ? method.getDecorator('Action').getStructure().arguments[0] : '';
                const formattedDescription = description ? description.substring(1, description.length - 1) : '';

                const m: BillyActionDocumentation = {
                    name: method.getName(),
                    description: formattedDescription,
                    comment: method.getJsDocs().map(doc => doc.getComment()).join('\n'),
                    return: this.getReturnDoc(method),
                    params: method.getParameters().map(param => {
                        const p: Param = {
                            name: param.getName(), type: param.getType().getText()
                        }
                        return p;
                    }),
                    docs: method.getJsDocs()
                        .map(docs => {
                            return docs.getTags().map(tag => {
                                const d: ParamDoc = {
                                    kind: tag.getTagName(),
                                    name: tag.getSymbol() ? tag.getSymbol().getName() : '',
                                    comment: tag.getComment()
                                }
                                return d;
                            })
                                .filter(metDoc => metDoc.kind === 'param')

                        })[0]
                }
                return m;
            });

        const description = c.getDecorator('Plugin') ? c.getDecorator('Plugin').getStructure().arguments[0] : '';
        const formattedDescription = description ? description.substring(1, description.length - 1) : '';

        // const classDescription = c.getJsDocs().map(doc => doc.getComment()).join('\n')
        const billy: BillyPluginDocumentation = {
            name: c.getName(),
            description: formattedDescription,
            methods: methods
        }

        return billy;
    }

}