import { expect } from 'chai';
import { listInventory, checkItemStock } from '../inventory';

describe('Inventory', () => {
  describe('listInventory', () => {
    it('should return an inventory', () => {
      expect(listInventory()).to.be.an('array');
    });
  });

  describe('checkItemStock', () => {
    it('should return true if enough of the item is in stock', () => {
      expect(checkItemStock("Cheese", 1)).to.be.true;
    });

    it('should return false if not enough of the item is in stock', () => {
      expect(checkItemStock("Cheese", 999)).to.be.false;
    });

    it('should return false if the item is not listed', () => {
      expect(checkItemStock("Gerald", 1)).to.be.false;
    });

    it('should return true if the type is simply "Sandwich"', () => {
      expect(checkItemStock("Sandwich", 999)).to.be.true;
    });
  });
});
