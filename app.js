"use strict";

const Web3 = require('web3');
const argv = require('yargs').argv;

async function createAccounts(n, url) {

    let web3 = new Web3(new Web3.providers.HttpProvider(url));
    
    let accounts = await web3.eth.getAccounts();
    let originalAccountCount = accounts.length;

    console.log('Existing accounts: ' + originalAccountCount);

    let i = originalAccountCount;
    while(i++ < n) {
        let done = false;
        while(!done) {
            try {
                let start = new Date();
                console.log('Creating new account ' + i + '...')
                await web3.eth.personal.newAccount('');
                let end = new Date() - start;
                console.log('Account created in: %dms', end);
                done = true;
            } catch(err) {
                console.log('Failed to create account, retrying...');
            }
        }
    }

    accounts = await web3.eth.getAccounts();
    console.log('Total accounts: ' + accounts.length);

    for(let i = 1; i < accounts.length; i++) {
        let done = false;
        while(!done) {
            console.log('Unlocking account ' + (i+1) + '...');
            try {
                let start = new Date();
                await web3.eth.personal.unlockAccount(accounts[i], '', 0);
                let end = new Date() - start;
                console.log('Account unlocked in: %dms', end);
                done = true;
            } catch(err) {
                console.log('Failed to unlock, retrying...');
            }
        }
    }

    let command = '';
    for(let account of accounts) {
        command += ' -a ' + account;
    }

    console.log(command);
}

if(argv.n && argv.url) {
    createAccounts(argv.n, argv.url);
} else {
    console.log('USAGE:\n --n number of accounts to create\n --url node URL (including credentials)\n');
}
