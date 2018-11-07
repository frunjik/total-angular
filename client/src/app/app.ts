export const app = {
    title: 'Workbench v0.0.1',
    history: [],
    default: 'current',
    // default: 'shader-builder',
    todo: [
        'make string-editor (shaders)',
        'make side menu nested',
        'make side menu global',
        'remembering state',
        'authentication',
        '-------------------',
        'DONE cmd new component',
        'DONE cmd new file',
        'DONE cmd new folder',
        'DONE set editor height (px)',
        'DONE history (browser)',
        'DONE folder/ file searching (find-file)',
        'DONE todo items better place',
        'DONE console (commands)',
        'DONE better file navigation',
        'DONE flex layout',
        'DONE better navigation',
        'DONE editor.filename*',
    ],
    parts: [
        { 
            title: 'current',
            kind: 'other',
            menu: false,
            filenames: [
                'client/src/app/app.ts',
                'client/src/app/home/home.component.ts',
                'client/src/app/home/home.component.html',
                'client/src/app/home/home.component.css',
            ]
        },
        page('home'),
        page('shader-builder'),
        page('threejs'),
        page('three-work'),
        page('wp3'),
        page('woodpusher'),
        page('current'),
        page('commands'),
        page('editor'),
        page('edit'),
        { 
            title: 'svg',
            kind: 'other',
            menu: false,
            filenames: [
                'client/src/assets/prompt.svg',
                'client/src/assets/bluerect.svg',
                'client/src/assets/example.svg',
            ]
        },
        { 
            title: 'app',
            kind: 'other',
            menu: false,
            filenames: sourceFilenames('app'),
        },
        component('find-file'),
        component('canvas'),
        component('property-editor'),
        component('object-editor'),
        component('edit-links'),
        component('edit-this'),
        { 
            title: 'services',
            kind: 'other',
            menu: false,
            filenames: [
                'client/src/app/fs.service.ts',
                'client/src/app/command.service.ts',
            ]
        },
        { 
            title: 'client',
            kind: 'other',
            menu: false,
            filenames: [
                'client/package.json',
                'client/src/index.html',
                'client/src/app/fs.service.ts',
                'client/src/app/app.module.ts',
                'client/src/app/app.component.ts',
                'client/src/app/app.component.html',
                'client/src/app/app.component.css',
                'client/src/app/edit/edit.component.ts',
                'client/src/app/edit/edit.component.html',
                'client/src/app/edit/edit.component.css',
                'client/src/app/editor/editor.component.ts',
                'client/src/app/editor/editor.component.html',
                'client/src/app/editor/editor.component.css',
                'client/src/app/home/home.component.ts',
                'client/src/app/home/home.component.html',
                'client/src/app/home/home.component.css',
                'client/src/app/pagenotfound/pagenotfound.component.ts',
                'client/src/app/pagenotfound/pagenotfound.component.html',
                'client/src/app/pagenotfound/pagenotfound.component.css',
            ]
        },
        { 
            title: 'server',
            kind: 'other',
            menu: false,
            filenames: [
                './README.md',
                'server/controllers/files.js',
                'server/controllers/angular.js',
                'server/controllers/commands.js',
            ]
        },
        { 
            title: 'tests',
            kind: 'other',
            menu: false,
            filenames: [
                'client/src/app/js/tests/unittest.ts',
                'client/src/app/js/tests/unittest_tests.ts',
            ]
        },
    ]
}

function sourceFilenames(elem, path='') {
    return [
        `client/src/app/${path}${elem}.component.ts`,
        `client/src/app/${path}${elem}.component.html`,
        `client/src/app/${path}${elem}.component.css`,
    ];
}

function pageFilenames(page) {
    return sourceFilenames(page, `${page}/`);
}

function componentFilenames(component) {
    return sourceFilenames(component, `components/${component}/`);
}

function component(name) {
    return {
        kind: 'component',
        menu: false,
        title: name,
        filenames: componentFilenames(name)
    };
}

function page(name) {
    return {
        kind: 'page',
        menu: true,
        title: name,
        filenames: pageFilenames(name)
    };
}

function nonMenuPage(name) {
    return {
        kind: 'page',
        menu: false,
        title: name,
        filenames: pageFilenames(name)
    };
}
