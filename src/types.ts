export interface Product {
  id: string;
  name: string;
  category: 'decorativa' | 'marmol' | 'canto_rodado' | 'triturados' | 'arenas';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  granulometry: string; // e.g. "1/2\" - 3/4\"", "6 - 7 cm", "Placas 30-50cm"
  coveragePerM2: string; // e.g. "45 - 50 kg por m² (capa de 4cm)"
  recommendedDepthCm: number;
  densityKgPerM3: number; // e.g. 1500 - 1700 kg/m³
  presentations: ('bulto_30kg' | 'bulto_40kg' | 'm3_granel' | 'tonelada')[];
  estimatedPriceCOP: number; // reference price per 25kg bag or standard unit
  priceUnitLabel: string;
  image: string;
  featured?: boolean;
  colors: string[];
  applications: string[];
  textureType: 'crystal' | 'river' | 'slate' | 'crushed' | 'marble';
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  presentation: 'bulto_30kg' | 'bulto_40kg' | 'm3_granel' | 'tonelada';
  calculatedArea?: number;
  calculatedDepth?: number;
}

export interface CalculatorState {
  shape: 'rect' | 'circle' | 'direct';
  length: number;
  width: number;
  diameter: number;
  directArea: number;
  depthCm: number;
  includeWastage: boolean; // standard +10%
  selectedProductId: string;
}
