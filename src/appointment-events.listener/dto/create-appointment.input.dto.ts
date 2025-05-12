export interface CreateAppointmentInputDto {
  id: string;
  date: string;
  status: string;
  establishment: Establishment;
  user: User;
  services: Service[];
  customer: Customer;
}

export interface Establishment {
  id: string;
  name: string;
  number: string;
  street: string;
  neighbourhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  accountId: string;
  locationLinks: LocationLinks;
}

export interface LocationLinks {
  waze: Waze;
}

export interface Waze {
  waze: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  establishmentId: string;
  extraDetails: ExtraDetails;
}

export type ExtraDetails = object;

export interface Customer {
  id: string;
  cpf: string;
  name: string;
}
