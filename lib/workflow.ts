import {Client as WorkflowClient} from '@upstash/workflow';
import { Client } from '@upstash/qstash';
import config from './config';

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken
})

export const qstash = new Client({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken!,
});