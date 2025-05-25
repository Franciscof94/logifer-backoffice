import { CSSProperties, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IProductsReportFilter } from "../../interfaces/SalesReport.interface";
import { ProductsReportFilter } from "./ProductsReportFilter";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch } from "react-redux";
import { setLoadingOrdersTable } from "../../store/slices/ordersSlice";
import ReportsService from "../../services/reports/reportsService";
import ClipLoader from "react-spinners/ClipLoader";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const override: CSSProperties = {
  display: "block",
  margin: "3px auto",
  borderColor: "#3342B1",
};

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
  },
};

export const ProductsReports = () => {
  const dispatch = useDispatch();
  const methods = useForm<IProductsReportFilter>();
  const [reports, setReports] = useState<number[]>();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { watch } = methods;

  const productValue = watch("productReport");
  const yearValue = watch("yearReport");
  const monthValue = watch("monthReport");

  const labels = isMobile ? [
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

  const selectedMonthLabel = labels[monthValue - 1];

  const filteredLabels = [selectedMonthLabel];

  const fetchReports = useCallback(async () => {
    try {
      dispatch(setLoadingOrdersTable(true));
      if (productValue && yearValue && monthValue) {
        setLoading(true);
        const reports = await ReportsService.getReportsByProducts(
          productValue,
          yearValue,
          monthValue
        );

        dispatch(setLoadingOrdersTable(false));
        setReports(reports);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, monthValue, productValue, yearValue]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, productValue, yearValue, monthValue]);

  const data = {
    labels: filteredLabels,
    datasets: [
      {
        label: "Cantidad",
        data: reports,
        backgroundColor: "#1c1ce3ad",
      },
    ],
  };

  return (
    <FormProvider {...methods}>
      <div>
        <ProductsReportFilter methods={methods} />
        {loading ? (
          <div className="flex justify-center my-12">
            <ClipLoader
              color={"#3342B1"}
              loading={loading}
              cssOverride={override}
              size={35}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            {productValue && yearValue && monthValue ? (
              <Card>
                <CardHeader>
                  <CardTitle>Reporte de Ventas por Producto</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className={`${isMobile ? 'h-[350px]' : 'h-[480px]'} w-full`}>
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
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex justify-center my-12 font-medium text-xl md:text-2xl text-danger text-center px-4">
                Seleccione un producto, un año y un mes para ver los reportes
              </div>
            )}
          </>
        )}
      </div>
    </FormProvider>
  );
};
