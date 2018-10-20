export const app = {
    title: 'Workbench v0.0.1',
    todo: [
        'make side menu nested',
        'make side menu global',
        'remembering state',
        'set editor height',
        'cmd new component',
        'cmd new file',
        'cmd new folder',
        'folder/ file searching',
        'authentication',
        '-------------------',
        'DONE todo items better place',
        'DONE console (commands)',
        'DONE better file navigation',
        'DONE flex layout',
        'DONE better navigation',
        'DONE editor.filename*',
    ],
    topics: [
        { 
            title: 'current',
            filenames: [
                'client/src/app/app.ts',
                'client/src/app/home/home.component.ts',
                'client/src/app/home/home.component.html',
                'client/src/app/home/home.component.css',
            ]
        },
        { 
            title: 'svg',
            filenames: [
                'client/src/assets/prompt.svg',
                'client/src/assets/bluerect.svg',
                'client/src/assets/example.svg',
            ]
        },
        page('home'),
        { 
            title: 'app',
            filenames: sourceFilenames('app'),
        },
        page('woodpusher'),
        page('commands'),
        page('edit'),
        page('editor'),
        component('canvas'),
        component('edit-links'),
        { 
            title: 'services',
            filenames: [
                'client/src/app/fs.service.ts',
                'client/src/app/command.service.ts',
            ]
        },
        { 
            title: 'client',
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
            filenames: [
                './README.md',
                'server/controllers/files.js',
                'server/controllers/commands.js',
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
        title: name,
        filenames: componentFilenames(name)
    };
}

function page(name) {
    return {
        title: name,
        filenames: pageFilenames(name)
    };
}
