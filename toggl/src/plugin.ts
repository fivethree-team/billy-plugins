import { Plugin, Action } from '@fivethree/billy-core';
import { Client, Report, Invoice, Day, Worksheet } from './types';
const TogglClient = require('toggl-api');
const inquirer = require('inquirer');
const chalk = require('chalk');
const moment = require('moment');
moment.locale('de');

@Plugin('toggl')
export class TogglPlugin {

    @Action('get toggl api data')
    async toggl(since: string, until: string, client: Client): Promise<Report> {
        const toggl = new Toggl();
        return await toggl.getReport(client, since, until)
    }

    @Action('get invoice from toggl report')
    invoice(report: Report, quote: number, since: string, until: string): Invoice {
        const toggl = new Toggl();
        return toggl.getInvoice(quote, since, until, report.total_grand);
    }

    @Action('get worksheet from toggl report')
    worksheet(report: Report, since: string, until: string): Worksheet {
        const toggl = new Toggl();
        return toggl.getWorksheet(since, until, report);
    }

    @Action('get clients')
    async getClients() {
        const toggl = new Toggl();
        return toggl.getClients();
    }

    @Action('prompt for client')
    async promptClient(clients: Client[]) {
        const toggl = new Toggl();
        return toggl.clientPrompt(clients);
    }
}

class Toggl {

    toggl;

    constructor() {
        this.toggl = new TogglClient({ apiToken: process.env.TOGGL_API_TOKEN });
    }

    async getClients(): Promise<Client[]> {
        return new Promise((resolve, reject) => {
            this.toggl.getClients(async (err, clients: Client[]) => {
                if (!err) {
                    resolve(clients);
                } else {
                    console.log('an error occured getting clients', err);
                    reject('an error occured getting clients')
                }
            });
        });
    }

    async clientPrompt(clients: Client[]) {
        return (await inquirer.prompt([
            {
                type: 'list',
                name: 'client',
                paginated: true,
                pageSize: 20,
                message: `${chalk.bold('Select a client')}`,
                choices: clients.map((client) => {
                    return { name: `${chalk.underline.blueBright(`${client.name}:`)}`, value: client };
                })
            }
        ])).client;
    }

    async getReport(client: Client, since: string, until: string): Promise<Report> {
        return new Promise((resolve, reject) => {
            this.toggl.detailedReport({
                workspace_id: client.wid,
                since: since,
                until: until,
                client_ids: client.id
            }, (err, report: Report) => {
                if (!err) {
                    resolve(report);
                } else {
                    console.log('error loading report', err);
                    reject();
                }
            });
        });
    }

    getInvoice(quote: number, from: string, to: string, total_grand: number): Invoice {
        const hours = moment.duration(total_grand).asHours().toFixed(0);
        const invoice: Invoice = {
            quote: quote,
            hours: hours,
            amount: parseInt(hours) * quote,
            date: moment().format('DD.MM.YYYY'),
            from: moment(from).format('DD.MM'),
            to: moment(to).format('DD.MM.YYYY')
        };

        return invoice;
    }

    getWorksheet(from: string, to: string, report: Report): Worksheet {
        const hours = moment.duration(report.total_grand).asHours().toFixed(0);
        const period = moment(from).format('DD.MM') + '-' + moment(to).format('DD.MM.YY');
        const PT = Math.round(moment.duration(report.total_grand).asHours() / 8).toFixed(2);
        const days: Day[] = this.getDays(from, to, report);
        const ws: Worksheet = { total: hours, period: period, PT: PT, days: days };
        return ws;
    }

    private getDays(from, to, report): Day[] {
        const days: Day[] = [];
        moment.setLocale
        const countDays = moment.duration(
            moment(to).diff(moment(from)))
            .asDays() + 1;
        const cal = new Array<Day>();
        const initial = parseInt(moment(from).format('D'));
        for (let i = initial; i - initial < countDays; i++) {
            cal.push({
                dayNumber: i.toString(),
                dayName: moment(from).add(i - 1, 'day').format('dd'),
                description: '',
                hours: ''
            });
        }
        for (let d of report.data) {
            days.push({
                dayName: moment(d.start).format('dd'),
                dayNumber: moment(d.start).format('D'),
                description: d.description,
                hours: Math.round(moment.duration(d.dur, 'ms').asHours()).toFixed(1)
            });
        }

        let sameDay: number = -1;
        for (let d of days) {
            const i = parseInt(d.dayNumber);
            const plus = parseFloat(d.hours);
            let hours;
            if (cal[i - initial].hours === '') {
                hours = 0;
            } else {
                hours = parseFloat(cal[i - initial].hours);
            }

            if (sameDay == i - 1) {
                cal[i - 1].description += ', ' + d.description;
            } else {
                cal[i - 1].description += d.description;
            }
            cal[i - 1].hours = (hours + plus).toString();
            sameDay = i - 1;
        }

        return cal;
    }
}