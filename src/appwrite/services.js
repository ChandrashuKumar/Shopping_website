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

    async createAddress({slug,address,contact,default:isDefault,userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                slug,
                {
                    userId,
                    address,
                    contact,
                    default: isDefault
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createAddress :: error", error);
        }
    }

    async updateAddress(slug,{address,contact,default:isDefault}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                slug,
                {
                   address,
                   contact,
                   default:isDefault

                }
            )
        } catch (error) {
            console.log("Appwrite service :: updateAddress :: error", error);
        }
    }

    async deleteAddress(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteAddress :: error", error);
            return false
        }
    }

    async getAddress(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionAdrId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getAddress :: error", error);
            return false
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
                        quantity: existingItem.documents[0].quantity + quantity
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