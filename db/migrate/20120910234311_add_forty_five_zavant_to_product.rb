class AddFortyFiveZavantToProduct < ActiveRecord::Migration
  def self.up    
    add_column :products, :fortyfivezav, :boolean
  end

  def self.down    
    remove_column :products, :fortyfivezav
  end
end
