import React, { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface BarChartProps {
  data: number[];
  title: string;
  description?: string;
  className?: string;
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  description,
  className = '',
}) => {
  const [chartData, setChartData] = useState<{ name: string; valor: number }[]>([]);

  useEffect(() => {
    const formattedData = data.map((value, index) => ({
      name: months[index],
      valor: value
    }));
    setChartData(formattedData);
  }, [data]);

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value}`, 'Valor']}
                labelFormatter={(label: string) => `${label}`}
              />
              <Legend />
              <Bar dataKey="valor" fill="#4f46e5" name="Valor" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
