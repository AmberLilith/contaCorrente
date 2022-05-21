const inquirer = require('inquirer');
const fs = require('fs');

function operations() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        },
    ]).then((answer) => {
        const action = answer['action']

        switch (action) {
            case 'Criar conta':
                createAccount();
            case 'Consultar Saldo':
                checkBalance();
                break
            case 'Consultar Saldo':
                break
            case 'Depositar':
                deposit();
                break
            case 'Sacar':
                withDraw()
                break
            case 'Sair':
                console.log("Até a próxima!");
                process.exit();


        }


        console.log(action);
    }).catch((err) => console.log(err))
}

function createAccount() {
    console.log("Parabéns por escolher nosso banco!");
    console.log('Defina as opções da sua conta a seguir');
    buildAccount();
}

function buildAccount() {

    inquirer.prompt([
        {
            name: "accountNumber",
            message: "Digite um número para sua conta:"
        }
    ]).then((answer) => {
        console.log(answer.accountNumber);
        saveCreatedAccount(answer.accountNumber);

    }).catch((err) => console.log(err));

}

function saveCreatedAccount(accountNumber) {
    if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts');
    }

    if (verifyIfExistsAccount(accountNumber)) {
        console.log("Conta já existe!");
        buildAccount();
        return
    }

    fs.writeFileSync(
        'accounts/account_' + accountNumber + '.json',
        '{"balance":0}',
        (err) => {
            console.log(err);
        },
    );

    console.log("Conta criada!");
    operations();
}

function verifyIfExistsAccount(accountNumber) {

    if (!fs.existsSync('accounts/account_' + accountNumber + '.json')) {
        return false
    }

    return true

}

function deposit() {
    inquirer.prompt([
        {
            name: 'numberAccount',
            message: 'Informe número da conta'
        }
    ]).then((answer => {
        const numberAccount = answer['numberAccount'];
        if (!verifyIfExistsAccount(numberAccount)) {
            console.log("Conta não existe!");
            return deposit();
        }
        inquirer.prompt([
            {
                name:'amount',
                message:'Informe valor a ser depositado:'
            }
        ]).then((answer)=>{
            const value = answer.amount;
            addAmount(numberAccount,value);

        }).catch(err => console.log(err));
    })
    ).catch(err => console.log(err));

}

function addAmount(numberAccount, amount) {
    if(!amount){
        console.log("Valor não informado ou inválido!");
        return operations();
    }

    const account = getAccount(numberAccount);
    account.balance = parseFloat(account.balance) + parseFloat(amount);
    fs.writeFileSync('accounts/account_'+numberAccount + '.json',JSON.stringify(account),(err) => {
        console.log(err);
    });

    console.log("Foi depositado o valor de R$ " + amount);
    operations();

}

function withDraw() {
    inquirer.prompt([
        {
            name: 'numberAccount',
            message: 'Informe número da conta'
        }
    ]).then((answer => {
        const numberAccount = answer['numberAccount'];
        if (!verifyIfExistsAccount(numberAccount)) {
            console.log("Conta não existe!");
            return deposit();
        }
        inquirer.prompt([
            {
                name:'amount',
                message:'Informe valor a ser sacado:'
            }
        ]).then((answer)=>{
            const value = answer.amount;
            withDrawAmount(numberAccount,value);

        }).catch(err => console.log(err));
    })
    ).catch(err => console.log(err));

}

function withDrawAmount(numberAccount, amount) {
    const account = getAccount(numberAccount);
    if(!amount || amount <= 0){
        console.log("Valor para saque informado é inválido!");
        return operations();
    }else if(account.balance >= amount){
        account.balance = parseFloat(account.balance) - parseFloat(amount);
    fs.writeFileSync('accounts/account_'+numberAccount + '.json',JSON.stringify(account),(err) => {
        console.err(err);
    });
    }else{
        console.log('Saldo insuficiente!');
        return operations();
    }

    console.log("Saque realizado com sucesso!");
    operations();

}


function getAccount(accountNumber) {
    const accountJSON = fs.readFileSync('accounts/account_' + accountNumber + '.json',
        {
            encoding: 'utf-8',
            flag: 'r'
        }
    );

    return JSON.parse(accountJSON);

}

function checkBalance() {
    inquirer.prompt([
        {
            name: 'numberAccount',
            message: 'Informe número da conta'
        }
    ]).then((answer => {
        const numberAccount = answer['numberAccount'];
        if (!verifyIfExistsAccount(numberAccount)) {
            console.log("Conta não existe!");
            return deposit();
        }

        getBalance(numberAccount);

        
    })
    ).catch(err => console.log(err));

}

function getBalance(numberAccount){
    const account = getAccount(numberAccount);
    console.log("Seu saldo atual é de R$ " + account.balance);
    operations();
}

module.exports = {
    operations

}

