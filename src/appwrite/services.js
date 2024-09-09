import conf from '../conf/conf'
import { Client, Databases,ID,Query } from 'appwrite'
export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createAddress({ address, contact, default: isDefault, userId }) {
        try {
            if (isDefault) {
                // Step 1: Fetch all addresses for the user
                const addresses = await this.getAllAddresses(userId);
                
                // Step 2: Update all other addresses to set default to false
                await Promise.all(
                    addresses.map(async (addr) => {
                        if (addr.default) {
                            await this.databases.updateDocument(
                                conf.appwriteDatabaseId,
                                conf.appwriteCollectionAdrId,
                                addr.$id,
                                { default: false }
                            );
                        }
                    })
                );
            }
    
            // Step 3: Create the new address
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                'unique()', // Auto-generate ID
                {
                    userId,
                    address,
                    contact,
                    default: isDefault
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createAddress :: error", error);
        }
    }
    

    async updateAddress(id, { address, contact, default: isDefault, userId }) {
        try {
            if (isDefault) {
                // Step 1: Fetch all addresses for the user
                const addresses = await this.getAllAddresses(userId);
                
                // Step 2: Update all other addresses to set default to false
                await Promise.all(
                    addresses.map(async (addr) => {
                        if (addr.$id !== id) {
                            await this.databases.updateDocument(
                                conf.appwriteDatabaseId,
                                conf.appwriteCollectionAdrId,
                                addr.$id,
                                { default: false }
                            );
                        }
                    })
                );
            }

            // Step 3: Update the selected address
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                id,
                {
                    address,
                    contact,
                    default: isDefault
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateAddress :: error", error);
        }
    }
    

    async deleteAddress(id) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                id // Use the document ID from Appwrite
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteAddress :: error", error);
            return false;
        }
    }
    

    async getAddress(id) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                id // Use the document ID from Appwrite
            );
        } catch (error) {
            console.log("Appwrite service :: getAddress :: error", error);
            return false;
        }
    }

    async getAllAddresses(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                [Query.equal('userId', userId)] // Query filter for userId
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getAllAddresses :: error", error);
            return [];
        }
    }
    
    

    async addToCart({userId,itemId,price}){
        try {
            const existingItem = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionCartId, 
                [Query.equal('userId', userId), Query.equal('itemId', itemId)]
            );
            if (existingItem.total > 0) {
                // Item already exists, update the quantity
                const itemDocId = existingItem.documents[0].$id;
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionCartId,
                    itemDocId,
                    {
                        quantity: existingItem.documents[0].quantity + 1
                    }
                );
            }
            else{
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionCartId,
                    ID.unique(),
                    {
                        userId,
                        itemId,
                        price
    
                    }
                )
            }
        } catch (error) {
            console.log("Appwrite service :: addToCart :: error", error);
        }
    }

    async deleteFromCart({userId,itemId}){
        try {
            // Find the document ID of the item to delete
            const existingItem = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionCartId, 
                [Query.equal('userId', userId), Query.equal('itemId', itemId)]
            );
            
            if (existingItem.total > 0) {
                const itemDocId = existingItem.documents[0].$id;
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionCartId,
                    itemDocId
                );
                return true;
            } else {
                // Item not found in the cart
                return false;
            }
        } catch (error) {
            console.log("Appwrite service :: deleteFromCart :: error", error);
            return false;
        }
    }

    async decrementQuantity({userId, itemId}) {
        try {
            const existingItem = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionCartId, 
                [Query.equal('userId', userId), Query.equal('itemId', itemId)]
            );
    
            if (existingItem.total > 0) {
                // Item already exists, check the quantity
                const itemDocId = existingItem.documents[0].$id;
                const currentQuantity = existingItem.documents[0].quantity;
    
                if (currentQuantity > 1) {
                    // If quantity is greater than 1, decrement it by 1
                    return await this.databases.updateDocument(
                        conf.appwriteDatabaseId,
                        conf.appwriteCollectionCartId,
                        itemDocId,
                        {
                            quantity: currentQuantity - 1
                        }
                    );
                } else {
                    // If quantity is 1, delete the item from the cart
                    return await this.deleteFromCart({ userId, itemId });
                }
            } else {
                return false; // Item does not exist
            }
            
        } catch (error) {
            console.log("Appwrite service :: decrementQuantity :: error", error);
        }
    }
    

    async getCartItem({userId, itemId}) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionCartId, 
                [Query.equal('userId', userId), Query.equal('itemId', itemId)]
            );
            console.log(response);
    
            // Check if the 'documents' array has at least one document
            if (response.total > 0 && response.documents.length > 0) {
                return true; // Item is in the cart
            } else {
                return false; // Item is not in the cart
            }
        } catch (error) {
            console.log("Appwrite service :: getCartItem :: error", error);
            return false; // Handle error by returning false
        }
    }
    

    async getCartItemsByUserId(userId) {
        try {
            const items = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionCartId,
                [Query.equal('userId', userId)]
            );
            return items.documents; // Return the array of cart items
        } catch (error) {
            console.log("Appwrite service :: getCartItemsByUserId :: error", error);
            return [];
        }
    }
    


}

const service  = new Service()
export default service