import { FastifyReply, FastifyRequest } from "fastify";
import { relationshipServices } from "../services/RelationshipServices";
import { relationshipSchema } from "../schemas/RelationshipSchema";
import multer from "multer";
import { uploadToFirebase } from "../services/FirebaseServices";
import {userService} from "../services/UserServices";
import {imageServices} from "../services/ImageServices";
import {paymentService} from "../services/PaymentServices";
import { Role } from "@prisma/client";
import { mailService } from "../services/NodeMailer";
const {
  createUser
} = userService;
const {
  createImage
} = imageServices;
const {
  createPayment
} = paymentService;

const upload = multer({ storage: multer.memoryStorage() });
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface MulterRequest extends FastifyRequest {
  files?: { [fieldname: string]: MulterFile[] };
}

export interface ImageAndContent {
  imageUrl: string;
  content: string;
}


export const RelationshipController = {
  async createRelationship(request: MulterRequest, reply: FastifyReply) {
    let relationshipData = relationshipSchema.parse(request.body);
    let userId: string;
    let relationShipId: string;

    const payer = {
      email: relationshipData.userEmail,
    };

    if (typeof relationshipData.content === "string") {
      relationshipData.content = JSON.parse(relationshipData.content);
    }
    
    try{
      const user = await createUser({
        email: payer.email,
        role: Role.USER,
      });
      userId = user.id;
    } catch(err: any){
      console.log(err)
      return reply.status(400).send({ message: err.message || "Erro ao criar Usuário" });
    }

    try{
      const relationship = await relationshipServices.createRelationShip(relationshipData, userId);
      relationShipId = relationship.id;
    }catch (err){
      return reply.status(400).send({ message: "Erro ao criar Relationship" });
    }

    try{
      const paymentRegister = await paymentService.registerPayment(relationShipId, relationshipData.plan);
    }catch (err){
      return reply.status(400).send({ message: "Erro ao registrar Pagamento" });
    }

    
    const files: MulterFile[] = [];
    const fileFields = ['file1', 'file2', 'file3', 'file4', 'file5', 'file6', 'file7', 'file8', 'file9', 'file10'];
    fileFields.forEach(field => {
      if (request.files && request.files[field]) {
        files.push(request.files[field][0]);
      }
    });

    try{
      const downloadURLs = await uploadToFirebase(files);
      const imagesAndContents: ImageAndContent[] = downloadURLs.map((url, index) => {
        return {
          imageUrl: url,
          content: relationshipData.content[index],
        };
      });

      const imageResult = imagesAndContents.forEach(async (imageAndContent) => {
        await createImage(imageAndContent, relationShipId);
      });
    } catch (error) {
      return reply.status(400).send({ message: "Erro ao criar imagem" });
    }

    

    try{
      const paymentResult = await createPayment({
        plan: relationshipData.plan,
        relationshipId: relationShipId,
        payer: payer,
      });
      const sendConfirmPaymentToEmail = await mailService.sendConfirmPayment(paymentResult?.ticket_url || '-', payer.email);
      return reply.status(201).send({ ticket_url:  paymentResult.ticket_url, qr_code:  paymentResult.qr_code});
    }catch(err){
      return reply.status(400).send({ message: "Erro ao criar link de pagamento" });
    }
   
  },


  async getRelationshipById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const relationship = await relationshipServices.getRelationshipById(id);
    if (!relationship) {
      return reply.status(404).send({ message: "Relacionamento não encontrado" });
    }
    if(relationship.status !== "PAID"){
      return reply.status(400).send({ message: "Relacionamento não está pago" });
    }
    return reply.status(200).send(relationship);
  },

  async getAllRelationships(request: FastifyRequest, reply: FastifyReply) {
    const relationships = await relationshipServices.getAllRelationships();
    return reply.status(200).send(relationships);
  },

  async updateRelationship(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const relationshipData = relationshipSchema.partial().parse(request.body);
    const relationship = await relationshipServices.updateRelationship(id, relationshipData);
    return reply.status(200).send(relationship);
  },

  async deleteRelationship(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await relationshipServices.deleteRelationship(id);
    return reply.status(204).send();
  },
};
