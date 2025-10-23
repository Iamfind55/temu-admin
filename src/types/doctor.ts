// export interface IDoctorTypes {
//   id: string;
//   status?: string;
//   created_at?: string;
//   firstName: string;
//   lastName?: string;
//   gender: string;
//   phone?: string;
//   email?: string;
//   address?: string;
//   profile: string;
//   bio?: string;
//   experience?: string;
//   hospital?: string;
//   link: string;
// }

export interface IDoctorTypes {
  id: string;
  status?: string;
  created_at?: string;
  firstName: string;
  lastName?: string;
  gender: string;
  phone?: string;
  email?: string;
  address1?: string;
  address2?: string;
  profile: string;
  bio?: string;
  experience?: string;
  hospital?: string;
  link: string;
  latitude?: number;
  longitude?: number;
  doctorSpecialists?: IDoctorSpecialistsTypes[];
}

// for client and public
export interface IDoctorPublicTypes {
  id: string;
  firstName: string;
  lastName?: string;
  gender: string;
  address?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  profile: string;
  bio?: string;
  experience?: string;
  experienceYears?: string;
  status?: string;
  educations?: IDoctorEducationTypes[];
  schedules?: IDoctorSchedulesTypes[];
  appointments?: IDoctorAppointmentTypes[];
  categories?: ICategoryTypes[];
  specialties?: IDoctorSpecialistsTypes[];
}

export interface IDoctorSpecialistsTypes {
  id: string;
  name: string;
}

export interface ICategoryTypes {
  id: string;
  name: string;
}

export interface IDoctorAppointmentTypes {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface IDoctorSchedulesTypes {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface IDoctorEducationTypes {
  id: string;
  degree: string;
  university: string;
  from: string;
  to: string;
}
