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
import { FormProvider, useForm } from "react-hook-form";
import { ISalesReportFilter } from "../../interfaces/SalesReport.interface";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoadingOrdersTable } from "../../store/slices/ordersSlice";
import ReportsService from "../../services/reports/reportsService";

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
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            const formattedNumber = context.parsed.y.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
            label += formattedNumber.replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
          }
          return label;
        },
      },
    },
  },
};
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

export const SalesReports = () => {
  const [reports, setReports] = useState<number[]>();
  const dispatch = useDispatch();
  const methods = useForm<ISalesReportFilter>();
  const { watch } = methods;
  const yearId = watch("yearReport");

  const fetchReports = useCallback(async () => {
    try {
      dispatch(setLoadingOrdersTable(true));
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const reports = await ReportsService.getReportsBySales(
        yearId || currentYear
      );
      dispatch(setLoadingOrdersTable(false));
      setReports(reports);
    } catch (error: any) {
      console.log(error);
    }
  }, [yearId, dispatch]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, yearId]);

  const data = {
    labels,
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
      <div className="">
        <SalesReportFilter methods={methods} />
        <div className="max-h-[480px] flex justify-center">
          <Bar options={options} data={data} />
        </div>
      </div>
    </FormProvider>
  );
};
