class AddShortdToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :shortd, :string
  end

  def self.down
    remove_column :products, :shortd
  end
end
