class AddChecksToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :twenty, :boolean
    add_column :products, :thirty, :boolean
    add_column :products, :forty, :boolean
    add_column :products, :sixty, :boolean
    add_column :products, :ninety, :boolean
    add_column :products, :astma, :boolean
    add_column :products, :alerg, :boolean
  end

  def self.down
    remove_column :products, :alerg
    remove_column :products, :astma
    remove_column :products, :ninety
    remove_column :products, :sixty
    remove_column :products, :forty
    remove_column :products, :thirty
    remove_column :products, :twenty
  end
end
