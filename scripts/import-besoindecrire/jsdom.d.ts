// jsdom ships no types and @types/jsdom isn't installed: only what convertHTMLToLexical needs.
declare module 'jsdom' {
  export class JSDOM {
    constructor(html: string)
    window: { document: Document }
  }
}
