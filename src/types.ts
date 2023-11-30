export type Sentence = {
    id: number;
    sentence: string;
    simplified: boolean;
}

export type Sentences = {
    _links: LinksProps;
    sentences: Array<Sentence>;
}

export type User = {
    id: number;
    name: string;
    username: string;
    created: string;
    // admin: boolean;
    completedSentences: number;
    completedVerifications: number;
};

export type Users = {
    _links: LinksProps;
    users: Array<User>;
}

export type PagingProps = {
    // limits: number;
    // offset: number;
    items?: Array<Sentence> | Array<User>;
    _links: LinksProps;
};

export type LinksProps = {
    self: {
      href: string;
    };
    prev?: {
      href: string;
    };
    next?: {
      href: string;
    };
};

export type Query = {
    offset: number;
    limit: number;
}