class AddProductIdToProdimag < ActiveRecord::Migration
  def self.up
    add_column :prodimags, :product_id, :integer
  end

  def self.down
    remove_column :prodimags, :product_id
  end
end
