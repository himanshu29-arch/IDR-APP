import { useToast } from "react-native-toast-notifications";
import {
  deleteInventoryFailure,
  deleteInventoryStart,
  deleteInventorySuccess,
} from "../slices/inventorySlice";
import { BASE_URL } from "../../services/apiConfig";
import { useSelector } from "react-redux";
import { loadString } from "../../utils/storage/storageHelpers";

// Delete inventory
export const deleteInventory = async (inventoryId) => {
  const token = await loadString("token");
  const toast = useToast();
  return async (dispatch) => {
    dispatch(deleteInventoryStart());
    try {
      await axios.delete(`${BASE_URL}/inventory/${inventoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deleteInventorySuccess(inventoryId));
      toast.show("Inventory deleted successfully", {
        type: "success",
      });
      toast.success("Inventory deleted successfully");
    } catch (error) {
      dispatch(deleteInventoryFailure(error.message));
      toast.show(
        error.response?.data?.message || "Failed to delete inventory",
        {
          type: "danger",
        }
      );
    }
  };
};
