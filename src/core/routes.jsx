import Landing from "@/pages/LandingPage/app";
import { Router, Route, RootRoute } from "@tanstack/react-router";

import Root from "./RootRouterWrapper";
import Login from "@/pages/auth/Login";
import Team from "@/pages/apps/Team";
import Customer from "@/pages/apps/Customer";
import Produk from "@/pages/apps/Product";
import Sales from "@/pages/apps/Sales";
import Vendor from "@/pages/apps/Vendor";
import TambahSales from "@/pages/apps/TambahSales";
import TransactionForm from "@/pages/apps/PageTambahPenjualan";
import SetorProduk from "@/pages/apps/PageSetorProduk";

// Root
const rootRoute = new RootRoute({
  component: Root,
});

// Index (App.tsx) route : Route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const loginPage = new Route({
  getParentRoute: () => rootRoute,
  path: "/masuk",
  component: Login,
});

const timRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/tim",
  component: Team,
});

const productRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/produk",
  component: Produk,
});
const setorProductRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/setor-barang",
  component: SetorProduk,
});

const customerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/konsumen",
  component: Customer,
});
const salesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/penjualan",
  component: Sales,
});
const addSalesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/tambah-penjualan",
  component: TransactionForm,
});

const detailSales = new Route({
  getParentRoute: () => salesRoute,
  path: "$idtransaksi",
  // parseParams: (params) => ({
  //   idtransaksi: z.number().int().parse(Number(params.idtransaksi)),
  // }),
  // stringifyParams: ({ idtransaksi }) => ({ idtransaksi: `${idtransaksi}` }),
  // validateSearch: (search) =>
  //   z
  //     .object({
  //       showNotes: z.boolean().optional(),
  //       notes: z.string().optionasl(),
  //     })
  //     .parse(search),
  // load: (opts) =>
  //   opts.context.queryClient.ensureQueryData(
  //     invoiceQueryOptions(opts.params.invoiceId)
  //   ),
  // component: ({ useSearch, useParams }) => {
  //   const params = useParams();
  //   const search = useSearch();
  //   const navigate = useNavigate();
  //   const invoiceQuery = useSuspenseQuery(
  //     invoiceQueryOptions(params.invoiceId)
  //   );
  //   const invoice = invoiceQuery.data;
  //   const updateInvoiceMutation = useUpdateInvoiceMutation();
  //   const [notes, setNotes] = React.useState(search.notes ?? "");

  //   React.useEffect(() => {
  //     navigate({
  //       search: (old) => ({
  //         ...old,
  //         notes: notes ? notes : undefined,
  //       }),
  //       replace: true,
  //     });
  //   }, [notes]);

  //   return (
  //     <form
  //       key={invoice.id}
  //       onSubmit={(event) => {
  //         event.preventDefault();
  //         event.stopPropagation();
  //         const formData = new FormData(event.target);
  //         updateInvoiceMutation.mutate({
  //           id: invoice.id,
  //           title: formData.get("title"),
  //           body: formData.get("body"),
  //         });
  //       }}
  //       className="p-2 space-y-2"
  //     >
  //       <InvoiceFields
  //         invoice={invoice}
  //         disabled={updateInvoiceMutation?.status === "pending"}
  //       />
  //       <div>
  //         <Link
  //           search={(old) => ({
  //             ...old,
  //             showNotes: old?.showNotes ? undefined : true,
  //           })}
  //           className="text-blue-700"
  //         >
  //           {search.showNotes ? "Close Notes" : "Show Notes"}{" "}
  //         </Link>
  //         {search.showNotes ? (
  //           <>
  //             <div>
  //               <div className="h-2" />
  //               <textarea
  //                 value={notes}
  //                 onChange={(e) => {
  //                   setNotes(e.target.value);
  //                 }}
  //                 rows={5}
  //                 className="shadow w-full p-2 rounded"
  //                 placeholder="Write some notes here..."
  //               />
  //               <div className="italic text-xs">
  //                 Notes are stored in the URL. Try copying the URL into a new
  //                 tab!
  //               </div>
  //             </div>
  //           </>
  //         ) : null}
  //       </div>
  //       <div>
  //         <button
  //           className="bg-blue-500 rounded p-2 uppercase text-white font-black disabled:opacity-50"
  //           disabled={updateInvoiceMutation?.status === "pending"}
  //         >
  //           Save
  //         </button>
  //       </div>
  //       {updateInvoiceMutation?.variables?.id === invoice.id ? (
  //         <div key={updateInvoiceMutation?.submittedAt}>
  //           {updateInvoiceMutation?.status === "success" ? (
  //             <div className="inline-block px-2 py-1 rounded bg-green-500 text-white animate-bounce [animation-iteration-count:2.5] [animation-duration:.3s]">
  //               Saved!
  //             </div>
  //           ) : updateInvoiceMutation?.status === "error" ? (
  //             <div className="inline-block px-2 py-1 rounded bg-red-500 text-white animate-bounce [animation-iteration-count:2.5] [animation-duration:.3s]">
  //               Failed to save.
  //             </div>
  //           ) : null}
  //         </div>
  //       ) : null}
  //     </form>
  //   );
  // },
  component: () => {
    <p>sasa</p>;
  },
});

const vendorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/vendor",
  component: Vendor,
});

// Create the router using your route tree
export const router = new Router({
  routeTree: rootRoute.addChildren([
    indexRoute,
    loginPage,
    timRoute,
    productRoute,
    customerRoute,
    salesRoute,
    vendorRoute,
    addSalesRoute,
    detailSales,
    setorProductRoute,
  ]),
});
