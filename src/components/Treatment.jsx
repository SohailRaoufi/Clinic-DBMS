import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Button,
  Typography,
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import OperationOptionsTable from '../components/Chart';
import ToothChart from '../components/ToothChart';

export default function AddTreatmentModal({
  mode,
  open,
  handleOpen,
  newTreatment,
  setNewTreatment,
  selectedOps,
  setSelectedOps,
  teethGraph,
  updateTeethGraph,
  selectTeeth,
  handleAddTreatment,
  showOperations = true,
  error,
}) {
  return (
    <Dialog size="md" open={open} handler={handleOpen} className="dialog p-4">
      <DialogHeader className="relative m-0 block">
        <IconButton
          size="sm"
          variant="text"
          className="xicon !absolute right-3.5 top-3.5"
          onClick={handleOpen}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
        <Typography variant="h4" color="blue-gray">
          {mode === 'edit' ? 'Edit Treatment' : 'Add Treatment'}
        </Typography>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6">
        <div className={`flex ${showOperations ? '' : 'justify-center'}`}>
          {showOperations && (
            <div className="grow xl:max-w-lg">
              <OperationOptionsTable
                chartStyle={{ head: '!mx-2 ' }}
                disabled={false}
                selectedOps={selectedOps}
                setSelectedOps={setSelectedOps}
              />
            </div>
          )}
          <span className="border-r border-gray-400 h-64 lg:hidden" />
          <div className="lg:bg-slate-800 lg:rounded xl:max-w-sm">
            <h1 className="text-white p-2 font-semibold text-center capitalize">
              Highlight the Teeth needing treatment
            </h1>
            <ToothChart
              teethStyle={'md:!w-56 lg:!w-64 '}
              teethIsSelected={teethGraph}
              selectTeethFunction={selectTeeth}
            />
          </div>
        </div>

        {showOperations && (
          <div className="mt-4 mb-4">
            {error && <Typography color="red">{error}</Typography>}
            <label className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="number"
              name="treatmentAmount"
              value={newTreatment.amount}
              onChange={(e) =>
                setNewTreatment({ ...newTreatment, amount: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <label className="block text-sm font-medium text-gray-700">
              Amount Paid
            </label>
            <input
              type="number"
              name="treatmentPaid"
              value={newTreatment.paid}
              onChange={(e) =>
                setNewTreatment({ ...newTreatment, paid: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          className={`ml-auto ${showOperations ? '' : 'w-full'}`}
          onClick={handleAddTreatment}
        >
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
