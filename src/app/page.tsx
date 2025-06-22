
"use client";

import { useState } from "react";
import { predictDiabetes, DiabetesFormData } from "./services/diabetesService";
import axios from "axios";
import { Modal } from "./components/Modal";


export default function Form() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{prediction: string, probability: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: DiabetesFormData = {
      HighBP: Number(formData.get("highBP") ? 1 : 0),
      HighChol: Number(formData.get("highChol") ? 1 : 0),
      BMI: Number(formData.get("bmi")),
      Smoker: Number(formData.get("smoker") ? 1 : 0),
      Stroke: Number(formData.get("stroke") ? 1 : 0),
      HeartDiseaseorAttack: Number(formData.get("heartDiseaseorAttack") ? 1 : 0),
      PhysActivity: Number(formData.get("physActivity") ? 1 : 0),
      Fruits: Number(formData.get("fruits") ? 1 : 0),
      Veggies: Number(formData.get("veggies") ? 1 : 0),
      HvyAlcoholConsump: Number(formData.get("hvyAlcoholConsump") ? 1 : 0),
      Sex: Number(formData.get("sex")),
      Age: Number(formData.get("age")),
    };

    try {
      setLoading(true);
      setError(null);
      const response = await predictDiabetes(payload);
      setResult(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao conectar com a API");
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="m-[3rem] p-[2rem] border border-neutral-300 rounded-md">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-8">
            <h2 className="text-lg font-semibold text-gray-900">Perfil de Saúde</h2>
            <p className="mt-1 text-sm text-gray-600">Avaliação de Risco de Diabetes</p>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4">
              <fieldset>
                <label className="block text-sm font-medium text-gray-900 mb-1">Sexo</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sex" value="1" defaultChecked /> Masculino
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sex" value="0" /> Feminino
                  </label>
                </div>
              </fieldset>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Faixa Etária</label>
                <select name="age" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2">
                  <option value="1">18-24 anos</option>
                  <option value="2">25-29 anos</option>
                  <option value="3">30-34 anos</option>
                  <option value="4">35-39 anos</option>
                  <option value="5">40-44 anos</option>
                  <option value="6">45-49 anos</option>
                  <option value="7">50-54 anos</option>
                  <option value="8">55-59 anos</option>
                  <option value="9">60-64 anos</option>
                  <option value="10">65-69 anos</option>
                  <option value="11">70-74 anos</option>
                  <option value="12">75-79 anos</option>
                  <option value="13">80 anos ou mais</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Índice de Massa Corporal (IMC)</label>
                <input type="number" name="bmi" step="0.1" placeholder="Ex.: 25.5" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2" />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-8">
            <h2 className="text-lg font-semibold text-gray-900">Condições de Saúde</h2>
            <div className="mt-6 space-y-4">
              {[{ name: "highBP", label: "Possui Pressão Alta" }, { name: "highChol", label: "Possui Colesterol Alto" }, { name: "heartDiseaseorAttack", label: "Histórico de Infarto ou Doença Cardíaca" }, { name: "stroke", label: "Já teve AVC (derrame)" }].map((item) => (
                <label key={item.name} className="flex items-center gap-2">
                  <input type="checkbox" name={item.name} className="checkbox" />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-8">
            <h2 className="text-lg font-semibold text-gray-900">Hábitos de Vida</h2>
            <div className="mt-6 space-y-4">
              {[{ name: "smoker", label: "Fumante" }, { name: "hvyAlcoholConsump", label: "Consome Álcool em Excesso" }, { name: "physActivity", label: "Pratica Atividade Física Regular" }, { name: "fruits", label: "Consome Frutas Diariamente" }, { name: "veggies", label: "Consome Verduras e Legumes Diariamente" }].map((item) => (
                <label key={item.name} className="flex items-center gap-2">
                  <input type="checkbox" name={item.name} className="checkbox" />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button type="reset" className="text-sm font-semibold text-gray-700">Cancelar</button>
          <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      <Modal isOpen={!!result} onClose={() => setResult(null)}>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold">Resultado da Análise</h2>
          <p className="text-center">
            <strong>Previsão:</strong> {result?.prediction}
          </p>
          <p className="text-center">
            <strong>Probabilidade:</strong> {(result?.probability ? result?.probability * 100 : 0).toFixed(2)}%
          </p>
          <button
            onClick={() => setResult(null)}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Fechar
          </button>
        </div>
      </Modal>

      {/* ❌ Modal Erro */}
      <Modal isOpen={!!error} onClose={() => setError(null)}>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-red-600">Erro</h2>
          <p className="text-center text-gray-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Fechar
          </button>
        </div>
      </Modal>

    </div>
  );
}
