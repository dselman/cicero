/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Template = require('@accordproject/cicero-core').Template;
const Clause = require('@accordproject/cicero-core').Clause;
const Engine = require('../lib/engine');

const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

const fs = require('fs');
const path = require('path');

describe('EngineLatePenalty', () => {

    let engine;
    let clause;
    const testLatePenaltyInput = fs.readFileSync(path.resolve(__dirname, 'data/latedeliveryandpenalty', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/latedeliveryandpenalty');
        clause = new Clause(template);
        clause.parse(testLatePenaltyInput);
    });

    afterEach(() => {});

    describe('#executeergo', function () {

        it('should execute a smart clause', async function () {
            const request = {};
            request.$class = 'io.clause.latedeliveryandpenalty.LateDeliveryAndPenaltyRequest';
            request.forceMajeure = false;
            request.agreedDelivery = '2017-10-07T16:38:01.412Z';
            request.goodsValue = 200.00;
            request.transactionId = '402c8f50-9e61-433e-a7c1-afe61c06ef00';
            request.timestamp = '2017-11-12T17:38:01.412Z';
            const state = {};
            state.$class = 'org.accordproject.cicero.contract.AccordContractState';
            state.stateId = '1';
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.penalty.should.equal(110);
        });
    });
});
describe('EngineVolumeDiscount', () => {

    let engine;
    let clause;
    const volumeDiscountInput = fs.readFileSync(path.resolve(__dirname, 'data/volumediscount', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/volumediscount');
        clause = new Clause(template);
        clause.parse(volumeDiscountInput);
    });

    afterEach(() => {});

    describe('#execute', function () {

        it('should execute a smart clause', async function () {
            const request = {
                '$class': 'org.accordproject.volumediscount.VolumeDiscountRequest',
                'netAnnualChargeVolume': 0.4
            };
            const state = {};
            state.$class = 'org.accordproject.cicero.contract.AccordContractState';
            state.stateId = '1';
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.discountRate.should.equal(3);
        });
    });

    describe('#execute', function () {

        it('should execute a smart clause falling back to JavaScript', async function () {
            const request = {
                '$class': 'org.accordproject.volumediscount.VolumeDiscountRequest',
                'netAnnualChargeVolume': 0.4
            };
            const state = {};
            state.$class = 'org.accordproject.cicero.contract.AccordContractState';
            state.stateId = '1';
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.discountRate.should.equal(3);
        });
    });
});
describe('EngineHelloWorld', () => {

    let engine;
    let clause;
    const helloWorldInput = fs.readFileSync(path.resolve(__dirname, 'data/helloworld', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/helloworld');
        clause = new Clause(template);
        clause.parse(helloWorldInput);
    });

    afterEach(() => {});

    describe('#execute', function () {

        it('should execute a smart clause', async function () {
            const request = {
                '$class': 'org.accordproject.helloworld.MyRequest',
                'input': 'Accord Project'
            };
            const state = {};
            state.$class = 'org.accordproject.cicero.contract.AccordContractState';
            state.stateId = '1';
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.output.should.equal('Hello Fred Blogs (Accord Project)');
        });

        it('should execute a smart clause with state initialization', async function () {
            const request = {
                '$class': 'org.accordproject.cicero.runtime.Request'
            };
            const result = await engine.init(clause, request);
            result.state.should.not.be.null;
            const state = result.state;
            state.$class.should.equal('org.accordproject.cicero.contract.AccordContractState');
            state.stateId.should.equal('org.accordproject.cicero.contract.AccordContractState#1');
            const request1 = {
                '$class': 'org.accordproject.helloworld.MyRequest',
                'input': 'Accord Project'
            };
            const result1 = await engine.execute(clause, request1, state);
            result1.should.not.be.null;
            result1.response.output.should.equal('Hello Fred Blogs (Accord Project)');
        });
    });
    describe('#execute2', function () {

        it('should execute a smart clause', async function () {
            try {
                const request = {
                    '$class': 'org.accordproject.helloworld.MyRequest',
                    'input': 'Accord Project'
                };
                const state = {};
                state.$class = 'org.accordproject.cicero.contract.AccordContractState';
                state.stateId = '1';
                const result = await engine.execute(clause, request, state);
                return result;
            } catch (err) {
                err.should.be.Error;
            }
        });
    });
});
describe('EngineHelloEmit', () => {

    let engine;
    let clause;
    const helloEmitInput = fs.readFileSync(path.resolve(__dirname, 'data/helloemit', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/helloemit');
        clause = new Clause(template);
        clause.parse(helloEmitInput);
    });

    afterEach(() => {});

    describe('#executeandemit', function () {

        it('should execute a smart clause which emits', async function () {
            const request = {
                '$class': 'org.accordproject.helloemit.MyRequest',
                'input': 'Accord Project'
            };
            const state = {};
            state.$class = 'org.accordproject.cicero.contract.AccordContractState';
            state.stateId = '1';
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.output.should.equal('Hello Fred Blogs (Accord Project)');
            result.emit[0].$class.should.equal('org.accordproject.helloemit.Greeting');
            result.emit[0].message.should.equal('Voila!');
        });
    });
});
describe('EngineSaft', () => {

    let engine;
    let clause;
    const saftInput = fs.readFileSync(path.resolve(__dirname, 'data/saft', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/saft');
        clause = new Clause(template);
        clause.parse(saftInput);
    });

    afterEach(() => {});

    describe('#execute', function () {

        it('should execute a smart clause', async function () {
            const request = {};
            const NS = 'org.accordproject.saft';
            request.$class = `${NS}.Launch`;
            request.exchangeRate = 100;
            const state = {};
            state.$class = 'org.accordproject.cicero.contract.AccordContractState';
            state.stateId = '1';
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.tokenAmount.should.equal(100);
            result.response.tokenAddress.should.equal('Daniel Charles Selman');
        });
    });
});
describe('BogusClauses', () => {
    let engine;
    let clause;
    const testNoLogic = fs.readFileSync(path.resolve(__dirname, 'data/no-logic', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/no-logic');
        clause = new Clause(template);
        clause.parse(testNoLogic);
    });

    afterEach(() => {});

    it('should throw error when no annotation in JavaScript logic', async () => {
        return (() => engine.buildDispatchFunction(clause)).should.throw('Did not find any function declarations with the @AccordClauseLogic annotation');
    });
    it('should throw an error when JavaScript logic is missing', async function() {
        // Turn all JavaScript logic into something else
        clause.getTemplate().getScriptManager().getScripts().forEach(function (element) {
            if (element.getLanguage() === '.js') {
                element.language = '.ergo';
            }
        }, this);
        (() => engine.compileJsClause(clause)).should.throw('Did not find any JavaScript logic');
    });
    it('should throw an error when all logic is missing', async function() {
        // Remove all scripts
        clause.getTemplate().getScriptManager().scripts = {};
        (() => engine.compileJsClause(clause)).should.throw('Did not find any JavaScript logic');
    });
});
describe('EngineInstallmentSaleJs', () => {

    let engine;
    let clause;
    const testLatePenaltyInput = fs.readFileSync(path.resolve(__dirname, 'data/installment-sale', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/installment-sale');
        clause = new Clause(template);
        clause.parse(testLatePenaltyInput);
    });

    afterEach(() => {});

    describe('#execute', function () {

        it('should execute a smart clause', async function () {
            const request = {};
            request.$class = 'org.accordproject.installmentsale.Installment';
            request.amount = 2500.00;
            const state = {};
            state.$class = 'org.accordproject.installmentsale.InstallmentSaleState';
            state.stateId = 'org.accordproject.installmentsale.InstallmentSaleState#1';
            state.status = 'WaitingForFirstDayOfNextMonth';
            state.balance_remaining = 10000.00;
            state.total_paid = 0.00;
            state.next_payment_month = 3.0;
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.balance.should.equal(7612.499999999999);
            result.state.balance_remaining.should.equal(7612.499999999999);
            result.state.total_paid.should.equal(2500.00);
        });

        it('should initialize a smart clause', async function () {
            const request = {};
            request.$class = 'org.accordproject.installmentsale.InitializeRequest';
            request.firstMonth = 1.0;
            const result = await engine.init(clause, request);
            result.should.not.be.null;
            result.response.should.not.be.null;
            result.state.balance_remaining.should.equal(10000.00);
            result.state.total_paid.should.equal(0.0);
        });

        it('should initialize a smart clause and execute one installment', async function () {
            const request = {};
            request.$class = 'org.accordproject.installmentsale.InitializeRequest';
            request.firstMonth = 1.0;
            const result = await engine.init(clause, request);
            result.should.not.be.null;
            result.response.should.not.be.null;
            result.state.balance_remaining.should.equal(10000.00);
            result.state.total_paid.should.equal(0.0);
            const request1 = {};
            request1.$class = 'org.accordproject.installmentsale.Installment';
            request1.amount = 2500.00;
            const result1 = await engine.execute(clause, request1, result.state);
            result1.should.not.be.null;
            result1.response.balance.should.equal(7612.499999999999);
            result1.state.balance_remaining.should.equal(7612.499999999999);
            result1.state.total_paid.should.equal(2500.00);
        });
    });
});
describe('EngineInstallmentSaleErgo', () => {

    let engine;
    let clause;
    const testLatePenaltyInput = fs.readFileSync(path.resolve(__dirname, 'data/installment-sale-ergo', 'sample.txt'), 'utf8');

    beforeEach(async function () {
        engine = new Engine();
        const template = await Template.fromDirectory('./test/data/installment-sale-ergo');
        clause = new Clause(template);
        clause.parse(testLatePenaltyInput);
    });

    afterEach(() => {});

    describe('#execute', function () {

        it('should execute a smart clause', async function () {
            const request = {};
            request.$class = 'org.accordproject.installmentsale.Installment';
            request.amount = 2500.00;
            const state = {};
            state.$class = 'org.accordproject.installmentsale.InstallmentSaleState';
            state.stateId = 'org.accordproject.installmentsale.InstallmentSaleState#1';
            state.status = 'WaitingForFirstDayOfNextMonth';
            state.balance_remaining = 10000.00;
            state.total_paid = 0.00;
            state.next_payment_month = 3.0;
            const result = await engine.execute(clause, request, state);
            result.should.not.be.null;
            result.response.balance.should.equal(7612.499999999999);
            result.state.balance_remaining.should.equal(7612.499999999999);
            result.state.total_paid.should.equal(2500.00);
        });

        it('should initialize a smart clause', async function () {
            const request = {};
            request.$class = 'org.accordproject.installmentsale.InitializeRequest';
            request.firstMonth = 1.0;
            const result = await engine.init(clause, request);
            result.should.not.be.null;
            result.response.should.not.be.null;
            result.state.balance_remaining.should.equal(10000.00);
            result.state.total_paid.should.equal(0.0);
        });

        it('should initialize a smart clause and execute one installment', async function () {
            const request = {};
            request.$class = 'org.accordproject.installmentsale.InitializeRequest';
            request.firstMonth = 1.0;
            const result = await engine.init(clause, request);
            result.should.not.be.null;
            result.response.should.not.be.null;
            result.state.balance_remaining.should.equal(10000.00);
            result.state.total_paid.should.equal(0.0);
            const request1 = {};
            request1.$class = 'org.accordproject.installmentsale.Installment';
            request1.amount = 2500.00;
            const result1 = await engine.execute(clause, request1, result.state);
            result1.should.not.be.null;
            result1.response.balance.should.equal(7612.499999999999);
            result1.state.balance_remaining.should.equal(7612.499999999999);
            result1.state.total_paid.should.equal(2500.00);
        });
    });
});
