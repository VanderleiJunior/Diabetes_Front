import api from './api';

export interface DiabetesFormData {
  HighBP: number;
  HighChol: number;
  BMI: number;
  Smoker: number;
  Stroke: number;
  HeartDiseaseorAttack: number;
  PhysActivity: number;
  Fruits: number;
  Veggies: number;
  HvyAlcoholConsump: number;
  Sex: number;
  Age: number;
}

export async function predictDiabetes(data: DiabetesFormData) {
  const response = await api.post('/predict', data);
  return response.data;
}
