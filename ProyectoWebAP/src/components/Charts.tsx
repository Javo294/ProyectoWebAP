import React from "react";

interface DatoGrafico {
  estado: string;
  valor: number;
  color: string;
}

interface ChartProps {
  datos: DatoGrafico[];
}

export const BarChart: React.FC<ChartProps> = ({ datos }) => {
  const maximo = Math.max(1, ...datos.map((d) => d.valor));
  const ancho = 320;
  const alto = 200;
  const margenInferior = 34;
  const margenSuperior = 16;
  const areaAlto = alto - margenInferior - margenSuperior;
  const anchoBarra = 46;
  const espacio = (ancho - datos.length * anchoBarra) / (datos.length + 1);

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} width="100%" style={{ maxWidth: ancho }} role="img">
      {[0, 0.5, 1].map((f) => {
        const y = margenSuperior + areaAlto * (1 - f);
        return (
          <line key={f} x1={0} y1={y} x2={ancho} y2={y} stroke="#232830" strokeWidth={1} />
        );
      })}
      {datos.map((d, i) => {
        const altoBarra = (d.valor / maximo) * areaAlto;
        const x = espacio + i * (anchoBarra + espacio);
        const y = margenSuperior + (areaAlto - altoBarra);
        return (
          <g key={d.estado}>
            <rect x={x} y={y} width={anchoBarra} height={altoBarra} rx={6} fill={d.color} />
            <text x={x + anchoBarra / 2} y={y - 6} textAnchor="middle" fill="#ffffff" fontSize={13} fontFamily="'Inter', sans-serif" fontWeight={700}>
              {d.valor}
            </text>
            <text x={x + anchoBarra / 2} y={alto - 12} textAnchor="middle" fill="#8a9bb0" fontSize={11} fontFamily="'Inter', sans-serif">
              {d.estado}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const DonutChart: React.FC<ChartProps> = ({ datos }) => {
  const total = datos.reduce((acc, d) => acc + d.valor, 0);
  const radio = 70;
  const grosor = 26;
  const circunferencia = 2 * Math.PI * radio;
  let acumulado = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
      <svg viewBox="0 0 180 180" width={180} height={180} role="img">
        <g transform="translate(90,90) rotate(-90)">
          <circle r={radio} fill="none" stroke="#232830" strokeWidth={grosor} />
          {total > 0 &&
            datos.map((d) => {
              const fraccion = d.valor / total;
              const largo = fraccion * circunferencia;
              const offset = acumulado;
              acumulado += largo;
              if (d.valor === 0) return null;
              return (
                <circle
                  key={d.estado}
                  r={radio}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={grosor}
                  strokeDasharray={`${largo} ${circunferencia - largo}`}
                  strokeDashoffset={-offset}
                />
              );
            })}
        </g>
        <text x={90} y={86} textAnchor="middle" fill="#ffffff" fontSize={26} fontWeight={700} fontFamily="'Inter', sans-serif">
          {total}
        </text>
        <text x={90} y={106} textAnchor="middle" fill="#8a9bb0" fontSize={12} fontFamily="'Inter', sans-serif">
          Total
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {datos.map((d) => (
          <div key={d.estado} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: d.color, display: "inline-block" }} />
            <span style={{ color: "#cdd6e0", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
              {d.estado}
            </span>
            <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
              {d.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
