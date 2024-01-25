export interface IEmployee {
  name: string;
  job: string;
  age?: number;
  start_date?: Date;
  end_date?: Date;
  id?: any;
}

export interface IFilter {
  name?: string;
  job?: string;
  age?: number;
  start_date?: Date;
  end_date?: Date;
}
