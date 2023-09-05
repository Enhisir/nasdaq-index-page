"use strict";

const api_key = "cd1ef4459b0af022f18da020211e3f8f";

let currentPage = 0;
let pageRowsRange = 15;

let companies = {
    symbols: [],
    addCompany: function(company) {
        this.symbols.push(company.symbol);
        this[company.symbol] = company;
    }
};

const nasdaqTableContainer = document.getElementById("nasdaq-100");
const nasdaqTable = document.getElementById("nasdaq-100-table");

async function loadTablePage(page) {
    nasdaqTable.tBodies[0].innerHTML = ""; // cleaning <tbody> section;
    currentPage = page;

    for (let i = page * pageRowsRange; i < (page + 1)  * pageRowsRange && i < companies.length; i++)
    {
        const stock = companies[companies.symbols[i]];

        const tableItem = document.createElement("tr");
        tableItem.innerHTML = `
            <td>${i + 1}</td>
            <td>${stock.symbol}</td>
            <td>${stock.name}</td>
            <td>${stock.changesPercentage}%</td>
            <td>$ ${stock.price}</td>
        `;
        tableItem.children[3].style.color = stock.changesPercentage < 0 ? "#cc1c27" : "#238267";

        nasdaqTable.tBodies[0].appendChild(tableItem);
    }

    addTablePagination();
}

async function addTablePagination() {
    let lastPage = Math.ceil(companies.length / pageRowsRange) - 1;

    const prevPageButton = document.getElementById("nasdaq-100-prev-button");
    const nextPageButton = document.getElementById("nasdaq-100-next-button");    

    prevPageButton.hidden = currentPage == 0;
    nextPageButton.hidden = currentPage == lastPage;
}

async function nextTablePage() {
    let lastPage = Math.ceil(companies.length / pageRowsRange) - 1;
    if (currentPage == lastPage) return;

    currentPage++;
    loadTablePage(currentPage);
}

async function prevTablePage() {
    let lastPage = Math.ceil(companies.length / pageRowsRange) - 1;
    if (currentPage == 0) return;

    currentPage--;
    loadTablePage(currentPage);
}

async function loadTable() {
    let responce = await fetch(`https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${api_key}`);
    let json = await responce.json();

    Object.defineProperty(companies, "length", {
        value: json.length,
        writable: true,
    });

    let ndq = [];
    for (let i = 0; i < json.length; i++) {
        companies.addCompany({
            symbol: json[i].symbol,
            name: json[i].name,
            changesPercentage: null,
            price: null,
        });
        ndq.push(json[i].symbol);
    }

    responce =  await fetch(`https://financialmodelingprep.com/api/v3/quote/${ndq.join(',')}?apikey=${api_key}`);
    json = await responce.json();

    for (let i = 0; i < json.length; i++) {
        companies[json[i].symbol].changesPercentage = json[i].changesPercentage;
        companies[json[i].symbol].price = json[i].price;
    }
    
    await loadTablePage(0);
}

loadTable();
addTablePagination();