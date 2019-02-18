
export interface BillyDocumentation {


    name: string;
    description: string;
    methods: BillyMethodDocumentation[]
}

export interface BillyPluginDocumentation {

    name: string;
    description: string;
    methods: BillyActionDocumentation[];
}

export interface LaneDocumentation {
    name: string;
    description: string;
}

export interface ScheduledDocumentation {
    name: string;
    humanReadable: string;
    schedule: string;
}

export interface HookDocumentation {
    name: string;
    hook: string;
}

export interface WebhookDocumentation {
    name: string;
    endpoint: string;
}

export interface BillyMethodDocumentation extends LaneDocumentation, ScheduledDocumentation, HookDocumentation, WebhookDocumentation {
    comment: string;
    return: ReturnDoc;
    params: Param[];
    docs: ParamDoc[];
}

export interface BillyActionDocumentation {
    name: string;
    description: string;
    comment: string;
    return: ReturnDoc;
    params: Param[];
    docs: ParamDoc[];
}

export interface Param { name: string; type: string }
export interface ParamDoc { kind: string; name: string, comment: string;  }
export interface ReturnDoc { type: string; comment: string; }

