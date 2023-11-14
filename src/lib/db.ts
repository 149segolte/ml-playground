import Dexie, { type Table } from 'dexie';

export interface Data {
	id?: number;
	name: string;
	csvData: string;
}

export class subDexie extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	data!: Table<Data>;

	constructor() {
		super('myDatabase');
		this.version(1).stores({
			data: '++id, name, csvData'
		});
	}
}

export const db = new subDexie();
