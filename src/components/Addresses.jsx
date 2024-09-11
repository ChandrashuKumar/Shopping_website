import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addAddress, updateAddress, removeAddress, setAddresses } from "../store/addressSlice";
import service from "../appwrite/services";

const AddressPage = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);
  const userId = useSelector((state) => state.auth.userData.$id);

  const [editAddressId, setEditAddressId] = useState(null); // Track if editing an address

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchAddresses = async () => {
    const allAddresses = await service.getAllAddresses(userId);
    dispatch(setAddresses(allAddresses));
  };

  useEffect(() => {
    fetchAddresses(); // Fetch addresses when the component is mounted
  }, []);


  const onSubmit = async (data) => {
    const addressData = {
      address: data.address,
      contact: data.contact,
      default: data.default || false,
      userId: userId,
    };

    if (editAddressId) {
      // If editing, update the address
      await service.updateAddress(editAddressId, addressData);
      dispatch(updateAddress({ id: editAddressId, updatedData: addressData }));
      setEditAddressId(null); // Reset edit mode
    } else {
      // If adding new address
      const newAddress = {
        ...addressData,
      };
      const response = await service.createAddress(newAddress);
      dispatch(addAddress({ ...newAddress, $id: response.$id }));
    }
    fetchAddresses();
    reset(); // Reset form
  };

  const handleEdit = async (id) => {
    const existingAddress = await service.getAddress(id);
    if (existingAddress) {
      setValue("address", existingAddress.address);
      setValue("contact", existingAddress.contact);
      setValue("default", existingAddress.default);
      setEditAddressId(id); // Set the id to know that we are editing
    }
  };

  const handleDelete = async (id) => {
    await service.deleteAddress(id);
    dispatch(removeAddress(id));
  };

  return (
    <div className="flex justify-start p-6 ml-8"> {/* Flex container to align content to the left with a slight shift to the right */}
      <div className="w-full max-w-2xl"> {/* Limit the max width of the entire container */}
        {/* Manage Addresses heading */}
        <h2 className="text-3xl font-semibold mb-8 text-center text-pink-300 underline">
          Manage Addresses
        </h2>

        {/* Form with centered text inside */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-lg mx-auto" // Added max-w-lg and centered the form
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Address</label>
            <input
              {...register("address", { required: "Address is required" })}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.address && <span className="text-red-600 text-sm text-center">{errors.address.message}</span>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Contact</label>
            <input
              {...register("contact", { required: "Contact is required" })}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.contact && <span className="text-red-600 text-sm text-center">{errors.contact.message}</span>}
          </div>

          <div className="flex items-center justify-center mb-6">
            <input
              type="checkbox"
              {...register("default")}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Set as default</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
          >
            {editAddressId ? "Update Address" : "Add Address"}
          </button>
        </form>

        {/* Saved Addresses */}
        <div>
          <h3 className="text-2xl text-pink-300 font-semibold mb-6 text-center underline">Saved Addresses</h3>
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.$id}
                className="bg-white p-4 border border-gray-300 shadow-md rounded-lg max-w-lg mx-auto" // Added max-w-lg to limit width of address boxes
              >
                <p className="font-medium text-lg text-center">{addr.address}</p>
                <p className="text-sm text-gray-600 text-center">{addr.contact}</p>
                <p className="text-sm text-gray-500 text-center">{addr.default ? "Default Address" : ""}</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(addr.$id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.$id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
