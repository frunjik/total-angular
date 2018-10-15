"use strict";

export function TestError(message) {
    this.message = message;
    // this.stack = (new Error()).stack;
}

TestError.prototype = Object.create(Error.prototype);
TestError.prototype.name = "TestError";
TestError.prototype.constructor = TestError;

// class TestError extends Error {
// }

export function assert(b, m) {
    if (!b) {
        throw new TestError('assertion failed: ' + (m || ''));
    }
}

export function assertEqual(a, e, m) {
    if (e !== a) {
        throw new TestError(`assertion failed: ${m} expected to be ${e} is ${a}`);
    }
}

function getAllFuncs(obj) {
    var props = [];

    var o = obj;
    do {
        props = props.concat(Object.getOwnPropertyNames(o));
    } while (o = Object.getPrototypeOf(o));

    return props.sort().filter(function(e, i, arr) { 
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}

export class TestSuite {
    tests = [];

    constructor(classOrNull) {
        if (classOrNull) {
            this.addTestsFromClass(classOrNull);
        }
    }

    addTest(c, name) {
        this.tests.push(new c(name));
    }

    addTestsFromClass(c) {
        const testnames = 
        getAllFuncs(new c(''))
            .filter(n => n.startsWith('test'));
        testnames
            .forEach(n => this.addTest(c, n));
    }

    run(result = null) {
        result = result || new TestResult();
        this.tests.forEach(test => {
            result.startTest(test);
            try {
                test.run();
            }
            catch(e) {
                if (!(e instanceof TestError))
                    console.error(e);
                result.failTest(test, e);
            }
        });
        return result;
    }
}

export class TestResult {
    runCount = 0;
    failures = [];

    startTest() {
        this.runCount++;
    }

    failTest(test, e) {
        if(test && e)
            this.failures.push(`${test.name}: ${e}`);
        else
            this.failures.push('Unknown failure');
    }

    summary() {
        return `${this.runCount} run, ${this.failures.length} failed`;
    }
}

export class TestCase {
    name;
    
    constructor(name) {
        this.name = name;
    }

    setUp() {
    }

    tearDown() {
    }

    runTest() {
        this[this.name]();
    }

    run() {
        let error;

        this.setUp();
        try {
            this.runTest();
        }
        catch(e) {
            error = e;
        }
        this.tearDown();

        if (error) {
            throw error;
        }
    }
}
