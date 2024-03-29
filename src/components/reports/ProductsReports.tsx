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
  plugins: {
    legend: {
      position: "top" as const,
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

  const { watch } = methods;

  const productValue = watch("productReport");
  const yearValue = watch("yearReport");
  const monthValue = watch("monthReport");

  const labels = [
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
    } catch (error: any) {
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
              <div className="max-h-[480px] flex justify-center">
                <Bar options={options} data={data} />
              </div>
            ) : (
              <div className="flex justify-center my-12 font-medium text-2xl text-danger">
                Seleccione un producto, un año y un mes para ver los reportes
              </div>
            )}
          </>
        )}
      </div>
    </FormProvider>
  );
};
