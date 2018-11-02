"use strict";

import { assert, assertEqual, TestCase, TestSuite, TestResult } from './unittest';

class WasRun extends TestCase {
    log = '';

    setUp() {
        this.log += 'setUp';
    }

    tearDown() {
        this.log += ' tearDown';
    }

    testWasRun() {
        this.log += ' wasRun';
    }

    testThrowsOnError() {
        assert(false, 'should break');
    }
}

class TestTestCase extends TestCase {
    testRun() {
        let test = new WasRun('testWasRun');
        test.run();
        assertEqual(test.log, 'setUp wasRun tearDown', 'testRunPattern');
    }

    testError() {
        let test = new WasRun('testThrowsOnError');
        let error;
        try{
            test.run();
        }
        catch(e) {
            error = e;
        }
        assert(error, 'testThrowsOnError: expected error, got none');
        assertEqual(test.log, 'setUp tearDown', 'teardown should be ran on Error');
    }

    testResult() {
        let result = new TestResult();
        assertEqual(result.summary(), '0 run, 0 failed');
        result.startTest();
        assertEqual(result.summary(), '1 run, 0 failed');
        result.failTest();
        assertEqual(result.summary(), '1 run, 1 failed');
    }

    testEmptySuite() {
        let suite  = new TestSuite ();
        let result = new TestResult();
        suite.run(result);
        assertEqual(result.summary(), '0 run, 0 failed');
    }

    testClassSuite() {
        let suite  = new TestSuite (WasRun);
        let result = suite.run();
        assertEqual(result.summary(), '2 run, 1 failed', 'result.summary()');
        assertEqual(result.failures.length, 1, '1 failure');
    }
}

export function run() {
    let suite  = new TestSuite (TestTestCase);
    let result = suite.run();
    if (result.failures) {
        console.log(result.failures);
    }
    return result;
}