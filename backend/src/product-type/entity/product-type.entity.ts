import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductTypeResponseDto } from '../dto/product-type-response.dto';

// enum Type {
//   GIFT_BOX = 'Hediye Kutuları',
//   CARGO_BAGS = 'Kargo Poşetleri',
//   NAPKINS = 'Peçeteler',
//   PLASTIC_CUPS = 'Plastik Bardaklar',
//   SAUCE_CONTAINERS = 'Sos Kapları',
//   ECO_FRIENDLY_BOXES = 'Çevre Dostu Kutular',
//   PLACEMAT = 'Amerikan Servis',
//   INFLUENCER_BOXES = 'Influencer Kutuları',
//   INVOICE_POUCH = 'Fatura Cebi',
//   PLASTIC_CUP_LIDS = 'Plastik Bardak Kapakları',
//   BOXES_WITH_LIDS = 'Kapaklı Kutular',
//   PAPER_BAG = 'Kese Kağıdı',
//   TISSUE_PAPER = 'Pelur',
//   BOOK_BOXES = 'Kitap Kutuları',
//   CARDBOARD_CUP_LIDS = 'Karton Bardak Kapakları',
//   CARDBOARD_SALAD_CONTAINERS = 'Karton Salata Kapları',
//   KRAFT_BAG = 'Kraft Çanta',
//   CARDBOARD_CUPS = 'Karton Bardaklar',
//   KRAFT_TAPE = 'Kraft Bant',
//   HONEYCOMB_PAPER = 'Petek Kağıt',
//   STRAWS = 'Pipetler',
//   GREASEPROOF_PAPER = 'Yağlı Kağıt',
//   CARDBOARD_BAGS = 'Karton Poşetler',
//   COLOGNE_WIPES = 'Kolonyalı Mendiller',
//   MAGNETIC_BOXES = 'Mıknatıslı Kutular',
//   PIZZA_BOXES = 'Pizza Kutuları',
//   SLEEVE = 'Sleeve',
//   AIRBED = 'Airbed',
//   CUP_CARRIER = 'Bardak Taşıyıcı',
//   CUTLERY_SET = 'Çatal Bıçak Seti',
//   SOUP_CONTAINERS = 'Çorba Kapları',
//   ICE_CREAM_CONTAINERS = 'Dondurma Kapları',
//   LABEL = 'Etiket',
//   FOOD_BOXES = 'Gıda Kutuları',
//   CLOTH_BAGS = 'Bez Çantalar',
//   ECOMMERCE_CARTONS = 'E-ticaret Kolileri',
//   ECOMMERCE_BOXES = 'E-ticaret Kutuları',
//   BROCHURES = 'Broşürler',
//   PACKING_TAPE = 'Koli Bandı',
//   STICKER = 'Sticker',
//   RIGID_BOX = 'Taslama Kutu',
//   ECO_FRIENDLY_BAGS = 'Çevre Dostu Poşetler',
//   FILLER_PAPER = 'Dolgu Kağıdı',
//   DOYPACK = 'Doypack',
//   KRAFT_MAILER_ENVELOPE = 'Kraft Kargo Zarf',
//   CAKE_BOXES = 'Pasta Kek Kutuları',
//   GIFT_CARDS = 'Hediye Kartları',
// }

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  toResponseObject(): ProductTypeResponseDto {
    const { id, name, description, createdAt, isActive } = this;

    const responseObject: ProductTypeResponseDto = {
      id,
      name,
      description,
      createdAt,
      isActive,
    };

    return responseObject;
  }
}
