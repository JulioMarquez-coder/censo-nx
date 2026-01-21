import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5, // personas: hhtp.get, check y sleep "pide data, verifica, espera, repite durante 15 seg."
  duration: '15s', // usando la app durante 15 segundos
};

export default function (): void {
  const res = http.get(
    'https://api.census.gov/data/2023/acs/acs5?get=NAME,B01003_001E&for=state:*'
  );

  check(res, {
    'status es 200': (r) => r.status === 200, // El servidor respondió bien
  });

  sleep(1); // El mismo usuario espera un segundo y sigue con su busqueda. 
}
