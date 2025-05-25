import { SalesReportFilter } from "./SalesReportFilter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatArgentinePrice } from "../../utils/formatters";
import { FormProvider, useForm } from "react-hook-form";
import { ISalesReportFilter } from "../../interfaces/SalesReport.interface";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setLoadingOrdersTable } from "../../store/slices/ordersSlice";
import ReportsService from "../../services/reports/reportsService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        boxWidth: 12,
        font: {
          size: 11
        }
      }
    },
    title: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function (context: { dataset: { label?: string }; parsed: { y: number | null } }) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            const formattedNumber = formatArgentinePrice(context.parsed.y, {
              decimalPlaces: 2
            });
            label += formattedNumber;
          }
          return label;
        },
      },
    },
  },
};
const getLabels = (isMobile: boolean) => {
  return isMobile ? [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ] : [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
};

export const SalesReports = () => {
  const [reports, setReports] = useState<number[]>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const methods = useForm<ISalesReportFilter>();
  const { watch } = methods;
  const yearId = watch("yearReport");
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      dispatch(setLoadingOrdersTable(true));
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      console.log(`Obteniendo reportes para el año: ${yearId || currentYear}`);
      const reports = await ReportsService.getReportsBySales(
        yearId || currentYear
      );
      dispatch(setLoadingOrdersTable(false));
      setReports(reports);
    } catch (error) {
      console.error('Error al obtener los reportes de ventas:', error);
      dispatch(setLoadingOrdersTable(false));
    }
  }, [yearId, dispatch]);

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (yearId) {
      fetchReports();
      return;
    }
    
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchReports();
    }
  }, [fetchReports, yearId]);

  const data = {
    labels: getLabels(isMobile),
    datasets: [
      {
        label: "Ventas",
        data: reports,
        backgroundColor: "#1c1ce3ad",
      },
    ],
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <SalesReportFilter methods={methods} />
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Ventas por Mes</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <div className={`${isMobile ? 'h-[350px]' : 'h-[480px]'} w-full`}>
              {reports ? (
                <Bar 
                  options={{
                    ...options,
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: isMobile ? 9 : 12
                          },
                          maxRotation: isMobile ? 45 : 0,
                          minRotation: isMobile ? 45 : 0
                        }
                      },
                      y: {
                        ticks: {
                          font: {
                            size: isMobile ? 10 : 12
                          }
                        }
                      }
                    }
                  }} 
                  data={data} 
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Cargando datos...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};
