///<reference types="react"/>

declare module "styled-components" {
  interface TemplateFunction<T> {
    (strings: TemplateStringsArray, ...params: any[]): React.StatelessComponent<T>;
  }

  interface ThemeProviderProps {
    theme: {
      [key: string]: string
    }
  }

  interface styled {
    abbr: TemplateFunction<any>;
    address: TemplateFunction<any>;
    area: TemplateFunction<any>;
    article: TemplateFunction<any>;
    aside: TemplateFunction<any>;
    audio: TemplateFunction<any>;
    b: TemplateFunction<any>;
    base: TemplateFunction<any>;
    bdi: TemplateFunction<any>;
    bdo: TemplateFunction<any>;
    big: TemplateFunction<any>;
    blockquote: TemplateFunction<any>;
    body: TemplateFunction<any>;
    br: TemplateFunction<any>;
    button: TemplateFunction<any>;
    canvas: TemplateFunction<any>;
    caption: TemplateFunction<any>;
    cite: TemplateFunction<any>;
    code: TemplateFunction<any>;
    col: TemplateFunction<any>;
    colgroup: TemplateFunction<any>;
    data: TemplateFunction<any>;
    datalist: TemplateFunction<any>;
    dd: TemplateFunction<any>;
    del: TemplateFunction<any>;
    details: TemplateFunction<any>;
    dfn: TemplateFunction<any>;
    dialog: TemplateFunction<any>;
    div: TemplateFunction<any>;
    dl: TemplateFunction<any>;
    dt: TemplateFunction<any>;
    em: TemplateFunction<any>;
    embed: TemplateFunction<any>;
    fieldset: TemplateFunction<any>;
    figcaption: TemplateFunction<any>;
    figure: TemplateFunction<any>;
    footer: TemplateFunction<any>;
    form: TemplateFunction<any>;
    h1: TemplateFunction<any>;
    h2: TemplateFunction<any>;
    h3: TemplateFunction<any>;
    h4: TemplateFunction<any>;
    h5: TemplateFunction<any>;
    h6: TemplateFunction<any>;
    head: TemplateFunction<any>;
    header: TemplateFunction<any>;
    hgroup: TemplateFunction<any>;
    hr: TemplateFunction<any>;
    html: TemplateFunction<any>;
    i: TemplateFunction<any>;
    iframe: TemplateFunction<any>;
    img: TemplateFunction<any>;
    input: TemplateFunction<any>;
    ins: TemplateFunction<any>;
    kbd: TemplateFunction<any>;
    keygen: TemplateFunction<any>;
    label: TemplateFunction<any>;
    legend: TemplateFunction<any>;
    li: TemplateFunction<any>;
    link: TemplateFunction<any>;
    main: TemplateFunction<any>;
    map: TemplateFunction<any>;
    mark: TemplateFunction<any>;
    menu: TemplateFunction<any>;
    menuitem: TemplateFunction<any>;
    meta: TemplateFunction<any>;
    meter: TemplateFunction<any>;
    nav: TemplateFunction<any>;
    noscript: TemplateFunction<any>;
    object: TemplateFunction<any>;
    ol: TemplateFunction<any>;
    optgroup: TemplateFunction<any>;
    option: TemplateFunction<any>;
    output: TemplateFunction<any>;
    p: TemplateFunction<any>;
    param: TemplateFunction<any>;
    picture: TemplateFunction<any>;
    pre: TemplateFunction<any>;
    progress: TemplateFunction<any>;
    q: TemplateFunction<any>;
    rp: TemplateFunction<any>;
    rt: TemplateFunction<any>;
    ruby: TemplateFunction<any>;
    s: TemplateFunction<any>;
    samp: TemplateFunction<any>;
    script: TemplateFunction<any>;
    section: TemplateFunction<any>;
    select: TemplateFunction<any>;
    small: TemplateFunction<any>;
    source: TemplateFunction<any>;
    span: TemplateFunction<any>;
    strong: TemplateFunction<any>;
    style: TemplateFunction<any>;
    sub: TemplateFunction<any>;
    summary: TemplateFunction<any>;
    sup: TemplateFunction<any>;
    table: TemplateFunction<any>;
    tbody: TemplateFunction<any>;
    td: TemplateFunction<any>;
    textarea: TemplateFunction<any>;
    tfoot: TemplateFunction<any>;
    th: TemplateFunction<any>;
    thead: TemplateFunction<any>;
    time: TemplateFunction<any>;
    title: TemplateFunction<any>;
    tr: TemplateFunction<any>;
    track: TemplateFunction<any>;
    u: TemplateFunction<any>;
    ul: TemplateFunction<any>;
    'var': TemplateFunction<any>;
    video: TemplateFunction<any>;
    wbr: TemplateFunction<any>;

// SVG
    circle: TemplateFunction<any>;
    clipPath: TemplateFunction<any>;
    defs: TemplateFunction<any>;
    ellipse: TemplateFunction<any>;
    g: TemplateFunction<any>;
    image: TemplateFunction<any>;
    line: TemplateFunction<any>;
    linearGradient: TemplateFunction<any>;
    mask: TemplateFunction<any>;
    path: TemplateFunction<any>;
    pattern: TemplateFunction<any>;
    polygon: TemplateFunction<any>;
    polyline: TemplateFunction<any>;
    radialGradient: TemplateFunction<any>;
    rect: TemplateFunction<any>;
    stop: TemplateFunction<any>;
    svg: TemplateFunction<any>;
    text: TemplateFunction<any>;
    tspan: TemplateFunction<any>;
  }

  interface styledFunction extends styled {
    (tag: string): TemplateFunction<any>
  }

  export class ThemeProvider extends React.Component<ThemeProviderProps, any> {}

  export const keyframes: (() => TemplateFunction<any>);

  export default {} as styledFunction;
}
