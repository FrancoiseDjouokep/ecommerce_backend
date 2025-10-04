import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class CategoryService {
  // 2. Injecter le PrismaService dans le constructeur
  constructor(private prisma: PrismaService) {} 
  //             ^^^^^^^^^^^^^^^^^^^^^^^^^^

  async create(createCategoryDto: CreateCategoryDto) {
    // Plus besoin de manipuler l'objet, car tous les champs sont obligatoires
    return await this.prisma.category.create({
      data: createCategoryDto, 
    });
  }


  async findAll() {
    // Récupère toutes les catégories (pour la liste déroulante)
    return await this.prisma.category.findMany({});
  }
}
